import { Component, Inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import heic2any from 'heic2any';
import dayjs from 'dayjs';
import { SessionQuery } from '@store/session.query';
import { CandidateService } from '@services/candidate.service';
import { Utils } from '@shared/utils';
import { Candidate, MaritalStatus } from '@models/candidate';
import {
  debounceTime,
  finalize,
  map,
  ReplaySubject,
  Subject,
  takeUntil,
} from 'rxjs';
import { Profession } from '@models/profession';
import { ProfessionService } from '@services/profession.service';
import { Estados } from '@models/utils';
import { UtilsService } from '@services/utils.service';
import { SelectionProcessService } from '@services/selection-process.service';
import { SelectionProcess } from '@models/selectionProccess';

@Component({
  selector: 'app-dialog-candidate',
  templateUrl: './dialog-candidate.component.html',
  styleUrl: './dialog-candidate.component.scss',
})
export class DialogCandidateComponent {
  protected form: FormGroup;
  protected loading: boolean;
  protected utils = Utils;
  protected _onDestroy = new Subject<void>();

  public allowedTypes = [/^image\//, /^application\/pdf$/];

  // Selects
  protected maritalStatusesEnum = Object.values(MaritalStatus);

  protected professionSelect: Profession[] = [];
  protected professionCtrl: FormControl<any> = new FormControl<any>(null);
  protected professionFilterCtrl: FormControl<any> = new FormControl<string>(
    ''
  );
  protected filteredProfessions: ReplaySubject<any[]> = new ReplaySubject<
    any[]
  >(1);

  protected processesSelect: SelectionProcess[] = [];
  protected processesCtrl: FormControl<any> = new FormControl<any>(null);
  protected filteredProcesses: ReplaySubject<any[]> = new ReplaySubject<any[]>(
    1
  );

  protected statuses = [
    {
      label: 'Ativo',
      value: 1,
    },
    {
      label: 'Inativo',
      value: 0,
    },
  ];

  // CEP
  public states: string[] = Object.values(Estados);

  public citys: string[] = [];
  public cityCtrl: FormControl<any> = new FormControl<any>(null);
  public cityFilterCtrl: FormControl<any> = new FormControl<string>('');
  public filteredCitys: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  constructor(
    @Inject(MAT_DIALOG_DATA) protected _data: Candidate,
    private fb: FormBuilder,
    private readonly _toastr: ToastrService,
    private readonly _candidateService: CandidateService,
    private dialogRef: MatDialogRef<DialogCandidateComponent>,
    private readonly _sessionQuery: SessionQuery,
    private readonly _dialog: MatDialog,
    private readonly _professionService: ProfessionService,
    private readonly _selectionProcess: SelectionProcessService,
    private readonly _utilsService: UtilsService
  ) {
    this.getProfessionsFromBack();
    this.getProcessFromBack();
  }

  ngOnInit() {
    const processes = this._data.processes.map( process => process.id);

    this.form = this.fb.group({
      name: [null, [Validators.required]],
      surname: [null, [Validators.required]],
      email: [null, [Validators.required]],
      cpf: [null, [Validators.required]],
      phone: [null, [Validators.required]],
      marital_status: [null, [Validators.required]],
      cep: [null, [Validators.required]],
      state: [null, [Validators.required]],
      city: [null, [Validators.required]],
      neighborhood: [null, [Validators.required]],
      street: [null, [Validators.required]],
      number: [null, [Validators.required]],
      profession_id: [null, [Validators.required]],
      // attachments: [null, [Validators.required]], ->. filesToSend
      processes: [processes ?? ''],
      is_active: [this._data?.is_active ?? true, [Validators.required]],
    });

    if (this._data) {
      this.form.patchValue({
        ...this._data,
        processes: processes
      });

      if (this._data.attachments) {
        this._data.attachments.forEach((file, index) => {
          this.filesFromBack.push({
            index: index,
            id: file.id,
            name: file.name,
            path: file.path,
          });
        });
      }
    }

    this.form.get('state').valueChanges.subscribe((res) => {
      this.atualizarCidades(res);
    });

    this.cityFilterCtrl.valueChanges.pipe().subscribe(() => {
      this.filterCitys();
    });

    this.form.get('cep').valueChanges.subscribe((res) => {
      this.autocompleteCep();
    });

    this.form.valueChanges.subscribe((res) => {
      console.log(res);
    });
  }

  protected onSubmit() {
    if (!this.form.valid || this.loading) {
      this.form.markAllAsTouched();
      this._toastr.error('Por favor, preencha todos os campos!');
      return;
    }

    // Criação do FormData
    const formData = new FormData();

    // Adiciona os campos do formulário ao FormData
    formData.append('name', this.form.get('name').value);
    formData.append('surname', this.form.get('surname').value);
    formData.append('email', this.form.get('email').value);
    formData.append('cpf', this.form.get('cpf').value);
    formData.append('phone', this.form.get('phone').value);
    formData.append('marital_status', this.form.get('marital_status').value);
    formData.append('cep', this.form.get('cep').value);
    formData.append('state', this.form.get('state').value);
    formData.append('city', this.form.get('city').value);
    formData.append('neighborhood', this.form.get('neighborhood').value);
    formData.append('street', this.form.get('street').value);
    formData.append('number', this.form.get('number').value);
    formData.append('profession_id', this.form.get('profession_id').value);
    formData.append('processes', this.form.get('processes').value);
    formData.append('is_active', this.form.get('is_active').value);

    if (this.filesToSend.length > 0) {
      // Adiciona arquivos com índices (attachments[0], attachments[1], etc.)
      this.filesToSend.forEach((file, index) => {
        formData.append(`attachments[${index}]`, file.file, file.file.name);
      });
    }

    // Se houver arquivos a remover
    // if (this.filesToRemove.length > 0) {
    //   this.filesToRemove.forEach((fileId) => {
    //     formData.append('remove_attachments[]', fileId.toString());
    //   });
    // }

    if (this._data && this._data?.id) {
      this._initOrStopLoading();

      this.filesToRemove.forEach((file) => {
        this._candidateService.deleteFile(file).subscribe({
          next: (res) => {},
          error: (err) => {
            this._toastr.error(err.error.error);
          },
        });
      });
      this.update(formData);
    } else {
      this.create(formData);
    }
  }

  private create(formData) {
    this._initOrStopLoading();

    this._candidateService
      .post(formData)
      .pipe(
        finalize(() => {
          this._initOrStopLoading();
        })
      )
      .subscribe({
        next: (res) => {
          this._toastr.success(res.message);
          this.dialogRef.close(formData);
        },
        error: (error) => {
          this._toastr.error(error.error.message);
        },
      });
  }

  private update(formData) {
    this._candidateService
      .patch(this._data?.id, formData)
      .pipe(
        finalize(() => {
          this._initOrStopLoading();
        })
      )
      .subscribe({
        next: (res) => {
          this._toastr.success(res.message);
          this.dialogRef.close(formData);
        },
        error: (error) => {
          this._toastr.error(error.error.message);
        },
      });
  }

  // Files

  protected filesToRemove: number[] = [];
  protected filesFromBack: {
    index: number;
    id: number;
    name: string;
    path: string; // Wasabi
  }[] = [];
  protected filesToSend: {
    id: number;
    preview: string;
    file: File;
  }[] = [];

  public async convertFileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  }

  public async onFileSelected(event: Event): Promise<void> {
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
          const blob = Array.isArray(convertedBlob)
            ? convertedBlob[0]
            : convertedBlob;

          // Cria o arquivo convertido
          convertedFile = new File(
            [blob],
            file.name.replace(/\.heic$/i, '.jpg'),
            { type: 'image/jpeg' }
          );
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

  // CEP
  protected atualizarCidades(uf: string): void {
    this._utilsService
      .obterCidadesPorEstado(uf)
      .pipe(map((res) => res.map((city) => city.nome)))
      .subscribe({
        next: (names) => {
          this.citys = names;
          this.filteredCitys.next(this.citys.slice());
        },
        error: (error) => {
          console.error('Erro ao obter cidades:', error);
        },
      });
  }

  protected filterCitys() {
    if (!this.citys) {
      return;
    }
    let search = this.cityFilterCtrl.value;
    if (!search) {
      this.filteredCitys.next(this.citys.slice());
      return;
    } else {
      search = search.toLowerCase();
    }

    this.filteredCitys.next(
      this.citys.filter((city) => city.toLowerCase().indexOf(search) > -1)
    );
  }

  protected autocompleteCep() {
    if (this.form.get('cep').value.length == 8) {
      this._utilsService
        .getAddressByCep(this.form.get('cep').value)
        .subscribe((res) => {
          if (res.erro) {
            this._toastr.error('CEP Inválido para busca!');
          } else {
            this.form.get('street').patchValue(res.logradouro);
            this.form.get('city').patchValue(res.localidade);
            this.form.get('neighborhood').patchValue(res.bairro);
            this.form.get('state').patchValue(res.uf);
          }
        });
    }
  }

  // Utils
  private _initOrStopLoading(): void {
    this.loading = !this.loading;
  }

  public onCancel(): void {
    this.dialogRef.close(false);
  }

  applyDateMask(event: any): void {
    let value = event.target.value;

    // Remove qualquer coisa que não seja número
    // value = value.replace(/\D/g, '');

    value = value.replace(/[a-zA-Z]/g, '');

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

  // Filters / Selects
  protected prepareFilterProfessionCtrl() {
    this.professionFilterCtrl.valueChanges
      .pipe(
        takeUntil(this._onDestroy),
        debounceTime(100),
        map((search: string | null) => {
          if (!search) {
            return this.professionSelect.slice();
          } else {
            search = search.toLowerCase();
            return this.professionSelect.filter((profession) =>
              profession.title.toLowerCase().includes(search)
            );
          }
        })
      )
      .subscribe((filtered) => {
        this.filteredProfessions.next(filtered);
      });
  }

  public clearProfessionId() {
    this.form.get('profession_id').patchValue('');
  }

  protected prepareFilterProcessesCtrl() {
    this.professionFilterCtrl.valueChanges
      .pipe(
        takeUntil(this._onDestroy),
        debounceTime(100),
        map((search: string | null) => {
          if (!search) {
            return this.processesSelect.slice();
          } else {
            search = search.toLowerCase();
            return this.processesSelect.filter((process) =>
              process.title.toLowerCase().includes(search)
            );
          }
        })
      )
      .subscribe((filtered) => {
        this.filteredProcesses.next(filtered);
      });
  }

  // Getters
  public getProfessionsFromBack() {
    this._professionService.getList().subscribe((res) => {
      this.professionSelect = res.data;

      this.filteredProfessions.next(this.professionSelect.slice());
      this.prepareFilterProfessionCtrl();
    });
  }

  public getProcessFromBack() {
    this._selectionProcess.getList().subscribe((res) => {
      this.processesSelect = res.data;

      this.filteredProcesses.next(this.processesSelect.slice());
      this.prepareFilterProcessesCtrl();
    });
  }
}
