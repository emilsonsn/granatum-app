import { HttpClient } from '@angular/common/http';
import { Component, computed, OnInit, Signal } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { MaritalStatus } from '@models/candidate';
import { ISmallInformationCard } from '@models/cardInformation';
import { SelectionProcess } from '@models/selectionProccess';
import { Estados } from '@models/utils';
import { SelectionProcessService } from '@services/selection-process.service';
import { UtilsService } from '@services/utils.service';
import { ToastrService } from 'ngx-toastr';
import { finalize, map, ReplaySubject } from 'rxjs';
import heic2any from 'heic2any';
import { CandidateService } from '@services/candidate.service';

@Component({
  selector: 'app-candidating',
  templateUrl: './candidating.component.html',
  styleUrls: ['./candidating.component.scss'],
})
export class CandidatingComponent implements OnInit {
  protected selectionProcess;
  protected candidatingForm: FormGroup;
  protected loading: boolean = false;

  protected cards = [
    {
      icon: 'fa-solid fa-circle-check',
      background: '#4CA750',
      title: 'Vagas Disponíveis',
      field: 'available_vacancies',
    },
    {
      icon: 'fa-solid fa-ban',
      background: '#dc3545',
      title: 'Total de Candidatos',
      field: 'total_candidates',
    },
  ];

  public allowedTypes = [/^image\//, /^application\/pdf$/];

  // Selects
  protected maritalStatusesEnum = Object.values(MaritalStatus);

  // CEP
  public states: string[] = Object.values(Estados);

  public citys: string[] = [];
  public cityCtrl: FormControl<any> = new FormControl<any>(null);
  public cityFilterCtrl: FormControl<any> = new FormControl<string>('');
  public filteredCitys: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  constructor(
    private readonly _activatedRoute: ActivatedRoute,
    private readonly _fb: FormBuilder,
    private readonly _selectionProcessService: SelectionProcessService,
    private readonly _http: HttpClient,
    private readonly _toastr: ToastrService,
    private readonly _router: Router,
    private readonly _utilsService: UtilsService,
    private readonly _candidateService : CandidateService,
  ) {
    const selectionProcessId =
      this._activatedRoute.snapshot.queryParamMap.get('selection_process');
    if (selectionProcessId) {
      this._selectionProcessService
        .getById(parseInt(selectionProcessId))
        .subscribe({
          next: (res) => {
            this.selectionProcess = res;
          },
          error: (error) => {
            this._toastr.error('Erro ao carregar processo!', error.message);
            this._router.navigate(['/login']);
          },
        });
    }
  }

  ngOnInit(): void {
    this.candidatingForm = this._fb.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      cpf: ['', [Validators.required, Validators.pattern(/^\d{11}$/)]],
      phone: ['', Validators.required],
      cep: ['', Validators.required],
      state: ['', Validators.required],
      city: ['', Validators.required],
      neighborhood: ['', Validators.required],
      street: ['', Validators.required],
      number: ['', Validators.required],
      marital_status: ['', Validators.required],
      // process: [this.selectionProcess?.id ?? null],
      // attachments: [],
    });

    this.candidatingForm.get('state').valueChanges.subscribe((res) => {
      this.atualizarCidades(res);
    });

    this.cityFilterCtrl.valueChanges.pipe().subscribe(() => {
      this.filterCitys();
    });

    this.candidatingForm.get('cep').valueChanges.subscribe((res) => {
      this.autocompleteCep();
    });

    this.candidatingForm.valueChanges.subscribe((res) => {
      console.log(res);
    })
  }

  protected onSubmit() {
    if (!this.candidatingForm.valid || this.loading) {
      this.candidatingForm.markAllAsTouched();
      this._toastr.error('Por favor, preencha todos os campos!');
      return;
    }

    // Criação do FormData
    const formData = new FormData();

    // Adiciona os campos do formulário ao FormData
    formData.append('name', this.candidatingForm.get('name').value);
    formData.append('surname', this.candidatingForm.get('surname').value);
    formData.append('email', this.candidatingForm.get('email').value);
    formData.append('cpf', this.candidatingForm.get('cpf').value);
    formData.append('phone', this.candidatingForm.get('phone').value);
    formData.append(
      'marital_status',
      this.candidatingForm.get('marital_status').value
    );
    formData.append('cep', this.candidatingForm.get('cep').value);
    formData.append('state', this.candidatingForm.get('state').value);
    formData.append('city', this.candidatingForm.get('city').value);
    formData.append(
      'neighborhood',
      this.candidatingForm.get('neighborhood').value
    );
    formData.append('street', this.candidatingForm.get('street').value);
    formData.append('number', this.candidatingForm.get('number').value);
    formData.append(
      'profession_id',
      this.candidatingForm.get('profession_id').value
    );
    formData.append('processes', this.selectionProcess?.id);
    formData.append('is_active', this.candidatingForm.get('is_active').value);

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

    this.create(formData);
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
        },
        error: (error) => {
          this._toastr.error(error.error.message);
        },
      });
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
    if (this.candidatingForm.get('cep').value.length == 8) {
      this._utilsService
        .getAddressByCep(this.candidatingForm.get('cep').value)
        .subscribe((res) => {
          if (res.erro) {
            this._toastr.error('CEP Inválido para busca!');
          } else {
            this.candidatingForm.get('street').patchValue(res.logradouro);
            this.candidatingForm.get('city').patchValue(res.localidade);
            this.candidatingForm.get('neighborhood').patchValue(res.bairro);
            this.candidatingForm.get('state').patchValue(res.uf);
          }
        });
    }
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

  // Utils
  private _initOrStopLoading(): void {
    this.loading = !this.loading;
  }
}
