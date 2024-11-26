import {Component, Inject} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {ToastrService} from "ngx-toastr";
import heic2any from "heic2any";
import {TravelService} from "@services/travel/travel.service";
import {ITravel} from "@models/Travel";
import dayjs from "dayjs";
import { SessionQuery } from '@store/session.query';
import { DialogOrderSolicitationComponent } from '../dialog-order-solicitation/dialog-order-solicitation.component';

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

  transportOptions = ['Carro próprio', 'Uber', 'Taxi', 'Motouber', 'Avião'];


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

  hasGranatum = false;

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
      total_value: ['', [Validators.required, Validators.min(0)]],
      purchase_date: [new Date(), [Validators.required]],
      observations: [''],
    });


    console.log(_data);

    if (_data) {
      this.isToEdit = 'true';
      this.title = 'Edição de Viagem';
      this.form.patchValue(_data);

      if (_data.files) {
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
  }

  public loadPermissionGranatum() {
    this._sessionQuery.user$.subscribe(user => {
      if (user && (user?.company_position.position === 'Financial' || user?.company_position.position === 'Admin')) {
        this.hasGranatum = true;
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
        this._toastr.success(res.message);
        this.dialogRef.close();
      },
      error: (error) => {
        this._toastr.error(error.error.message);
      },
    });
  }

  public throwToGranatum(){}

  public async onFileSelected(event: Event): Promise<void> {
    debugger;
    const input = event.target as HTMLInputElement;
    if (!input.files) return;

    const files: FileList = input.files;
    const fileArray: File[] = Array.from(files);

    for (const file of fileArray) {
      let fileType = file.type;
      let convertedFile: File | null = null;

      // Detecta e converte arquivos HEIC
      if (file.name.toLowerCase().endsWith('.heic') || fileType === '') {
        try {
          // Converte HEIC para JPEG
          const convertedBlob = await heic2any({
            blob: file,
            toType: 'image/jpeg',
          });

          // Asegure que o Blob é um único Blob e não um array
          const blob = Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob;

          // Cria o arquivo convertido
          convertedFile = new File([blob], file.name.replace(/\.heic$/i, '.jpg'), {type: 'image/jpeg'});
          fileType = 'image/jpeg';
        } catch (error) {
          this._toastr.error('Erro ao converter HEIC para JPEG.');
          continue; // Pula para o próximo arquivo
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

        // Adiciona arquivo à lista
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

    // Remove qualquer coisa que não seja número
    // value = value.replace(/\D/g, '');

    value = value.replace(/[a-zA-Z]/g, "");

    // Adiciona a máscara 'dd/MM/yyyy' conforme o valor do input
    if (value.length <= 2) {
      value = value.replace(/(\d{2})(\d{1,})/, '$1/$2');
    }
    // Second condition: format as MM/DD/
    else if (value.length <= 4) {
      value = value.replace(/(\d{2})(\d{2})(\d{0,})/, '$1/$2/');
    }
    // Third condition: format as MM/DD/YYYY
    else {
      value = value.replace(/(\d{2})(\d{2})(\d{2})(\d{0,})/, '$1/$2/$3');
    }

    // Atualiza o valor do input
    event.target.value = value;
  }

  onSubmit(form: FormGroup) {
    if (!form.valid) {
      form.markAllAsTouched();
    } else {
      // Criação do FormData
      const formData = new FormData();

      // Adiciona os campos do formulário ao FormData
      formData.append('description', form.value.description);
      formData.append('type', form.value.type);
      formData.append('transport', form.value.transport);
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
