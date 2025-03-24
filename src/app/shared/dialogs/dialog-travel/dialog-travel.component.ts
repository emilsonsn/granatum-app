import {Component, Inject, signal} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {ToastrService} from "ngx-toastr";
import heic2any from "heic2any";
import {TravelService} from "@services/travel/travel.service";
import {ITravel} from "@models/Travel";
import dayjs from "dayjs";
import { SessionQuery } from '@store/session.query';
import { DialogOrderSolicitationComponent } from '../dialog-order-solicitation/dialog-order-solicitation.component';
import { Banco } from '@models/requestOrder';
import { ApiResponse } from '@models/application';

@Component({
  selector: 'app-dialog-travel',
  templateUrl: './dialog-travel.component.html',
  styleUrl: './dialog-travel.component.scss'
})
export class DialogTravelComponent {
  form: FormGroup;
  loading: boolean;
  isToEdit: string;
  title: string = 'Cadastro de Viagem';

  transportOptions = [
      'Carro próprio',
      'Uber',
      'Taxi',
      'Motouber',
      'Ônibus',
      'Avião'
  ];

  public allowedTypes = [/^image\//, /^application\/pdf$/];
  protected filesToRemove: number[] = [];
  protected filesFromBack: {
    index: number,
    id: number,
    name: string,
    path: string, // Wasabi
  }[] = [];
  protected filesToSend: {
    id: number,
    preview: string,
    file: File,
  }[] = [];

  NotColaborator = false;
  isFinancial = false;

  public bancos = signal<Banco[]>([]);
  public categories = signal<any[]>([]);
  public costCenters = signal<any[]>([]);
  public tags = signal<any[]>([]);
  public supliers = signal<any[]>([]);
  
  constructor(
    private fb: FormBuilder,
    private readonly _toastr: ToastrService,
    private readonly _travelService: TravelService,
    private dialogRef: MatDialogRef<DialogTravelComponent>,
    private readonly _sessionQuery: SessionQuery,
    private readonly _dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public _data: ITravel
  ) {
    this.form = this.fb.group({
      description: ['', [Validators.required]],
      type: ['', [Validators.required]],
      transport: ['', [Validators.required]],
      bank_id: [''],
      category_id: [''],
      tag_id: [''],
      cost_center_id: [''],
      external_suplier_id: [''],
      total_value: ['', [Validators.required, Validators.min(0)]],
      purchase_date: [new Date(), [Validators.required]],
      observations: [''],
    });
  }

  ngOnInit(){

    this._travelService.getBank().subscribe((b: ApiResponse<Banco[]>) => {
      this.bancos.set(b.data);
    })

    this._travelService.getCategories().subscribe((b: ApiResponse<any[]>) => {
      this.categories.set(b.data);
    })

    this._travelService.getCostCenter().subscribe((b: ApiResponse<any[]>) => {
      this.costCenters.set(b.data);
    })

    this._travelService.getTags().subscribe((b: ApiResponse<any[]>) => {
      this.tags.set(b.data);
    })

    this._travelService.getSuplier().subscribe((b: ApiResponse<any[]>) => {
      this.supliers.set(b.data);
    })    

    if (this._data) {
      this.isToEdit = 'true';
      this.title = 'Edição de Viagem';

      this.form.patchValue({
        ...this._data,
        purchase_date: this._data.purchase_date ? new Date(`${this._data.purchase_date}T12:00:00`) : null,
      });        

      if (this._data.files) {
        this._data.files.forEach((file, index) => {
          this.filesFromBack.push({
            index: index,
            id: file.id,
            name: file.name,
            path: file.path
          });
        });
      }
    }

    this.loadPermissionGranatum();
  }

  public loadPermissionGranatum() {
    this._sessionQuery.user$.subscribe(user => {
      if (user && user?.company_position.position !== 'Requester') {
        this.NotColaborator = true;
      }

      if (user && user?.company_position.position === 'Financial' || user?.company_position.position === 'Admin' ) {
        this.isFinancial = true;
      }
    })
  }

  public onCancel(): void {
    this.dialogRef.close(false);
  }

  public async convertFileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  }

  public onSolicitation() {
    const data = {}
    this._dialog
      .open(DialogOrderSolicitationComponent, {
        data,
        width: '80%',
        maxWidth: '550px',
        maxHeight: '90%',
      })
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          this.updateSolicitation(res);
        }
      });
  }

  public updateSolicitation(res: any) {
    this._travelService.updateSolicitation(this._data.id, res)
    .subscribe({
      next: (res) => {
        console.log('entrei');
        this._toastr.success(res.message);
        this.dialogRef.close(true);
      },
      error: (error) => {
        console.log('entrei');
        this._toastr.error(error);
      },
    });
  }

  public throwToGranatum(){
    if(this._data.id){
      this._travelService.upRelease(this._data.id)
      .subscribe({
        next: (res) => {
          this._toastr.success(res.message);
          this.dialogRef.close(true);        
        },
        error: (error) => {
          this._toastr.error(error.error.error);
        }
      });
    }
  }

  public async onFileSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;

    const files: FileList = input.files;
    const fileArray: File[] = Array.from(files);

    for (const file of fileArray) {
      let fileType = file.type;
      let convertedFile: File | null = null;

      if (file.name.toLowerCase().endsWith('.heic') || fileType === '') {
        try {
          const convertedBlob = await heic2any({
            blob: file,
            toType: 'image/jpeg',
          });

          const blob = Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob;

          convertedFile = new File([blob], file.name.replace(/\.heic$/i, '.jpg'), {type: 'image/jpeg'});
          fileType = 'image/jpeg';
        } catch (error) {
          this._toastr.error('Erro ao converter HEIC para JPEG.');
          continue;
        }
      }

      const processedFile = convertedFile || file;

      // Verifica se o tipo é permitido
      if (this.allowedTypes.some((type) => type.test(fileType))) {
        let base64: string | null = null;

        // Converte imagem para Base64
        if (fileType.startsWith('image/')) {
          try {
            base64 = await this.convertFileToBase64(processedFile);
          } catch (error) {
            this._toastr.error('Erro ao processar a imagem.');
            continue;
          }
        }

        this.filesToSend.push({
          id: Date.now(),
          preview: base64,
          file: processedFile,
        });
      } else {
        const readableType = fileType.startsWith('image/')
          ? 'Imagem'
          : fileType === 'application/pdf'
            ? 'PDF'
            : 'Arquivo desconhecido';
        this._toastr.error(`${readableType} não é permitido`);
      }
    }
  }

  public removeFileFromSendToFiles(index: number) {
    if (index > -1) {
      this.filesToSend.splice(index, 1);
    }
  }

  public prepareFileToRemoveFromBack(fileId, index) {
    this.filesFromBack.splice(index, 1);
    this.filesToRemove.push(fileId);
  }

  public openImgInAnotherTab(url: string) {
    window.open(url, '_blank');
  }

  applyDateMask(event: any): void {
    let value = event.target.value;

    value = value.replace(/[a-zA-Z]/g, "");

    if (value.length <= 2) {
      value = value.replace(/(\d{2})(\d{1,})/, '$1/$2');
    }
    else if (value.length <= 4) {
      value = value.replace(/(\d{2})(\d{2})(\d{0,})/, '$1/$2/');
    }
    else {
      value = value.replace(/(\d{2})(\d{2})(\d{2})(\d{0,})/, '$1/$2/$3');
    }

    event.target.value = value;
  }

  onSubmit(form: FormGroup) {
    if (!form.valid) {
      form.markAllAsTouched();
    } else {
      const formData = new FormData();

      formData.append('description', form.value.description);
      formData.append('type', form.value.type);
      formData.append('transport', form.value.transport);
      formData.append('bank_id', form.value.bank_id ?? '');
      formData.append('category_id', form.value.category_id ?? '');
      formData.append('tag_id', form.value.tag_id ?? '');
      formData.append('external_suplier_id', form.value.external_suplier_id ?? '');
      formData.append('cost_center_id', form.value.cost_center_id ?? '');
      formData.append('total_value', form.value.total_value);
      formData.append('purchase_date', dayjs(form.value.purchase_date).format('YYYY-MM-DD'));
      formData.append('observations', form.value.observations || '');

      if (this.filesToSend.length > 0) {
        // Adiciona arquivos com índices (attachments[0], attachments[1], etc.)
        this.filesToSend.forEach((file, index) => {
          formData.append(`attachments[${index}]`, file.file, file.file.name);
        });

        // Se houver arquivos a remover
        if (this.filesToRemove.length > 0) {
          this.filesToRemove.forEach(fileId => {
            formData.append('remove_attachments[]', fileId.toString());
          });
        }
      }

      if (this._data && this._data?.id) {
        formData.append('id', this._data.id.toString());
        this.filesToRemove.forEach(file => {
          this._travelService.deleteFile(file)
            .subscribe({
              next: (res) => {

              },
              error: (err) => {
                this._toastr.error(err.error.error);
              }
            })
        })
        this.update(formData);
      } else {
        this.create(formData);
      }
    }
  }

  create(formData) {
    this._travelService.create(formData).subscribe(
      {
        next: (res) => {
          this._toastr.success(res.message);
          this.dialogRef.close(formData);
        },
        error: (error) => {
          this._toastr.error(error.error.message);
        }
      }
    );
  }

  update(formData) {
    this._travelService.update(formData.get('id'), formData).subscribe(
      {
        next: (res) => {
          this._toastr.success(res.message);
          this.dialogRef.close(formData);
        },
        error: (error) => {
          this._toastr.error(error.error.message);
        }
      }
    );
  }
}
