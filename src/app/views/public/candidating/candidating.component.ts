import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { SelectionProcessService } from '@services/selection-process.service';

@Component({
  selector: 'app-candidating',
  templateUrl: './candidating.component.html',
  styleUrls: ['./candidating.component.scss']
})
export class CandidatingComponent implements OnInit {
  selectionProcess: any = null;
  candidatingForm!: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private _fb: FormBuilder,
    private readonly selectionProcessService: SelectionProcessService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    const selectionProcessId = this.route.snapshot.queryParamMap.get('selection_process');
    if (selectionProcessId) {
      this.selectionProcessService.getById(parseInt(selectionProcessId))
        .subscribe({
          next: (res) => {
            this.selectionProcess = res;
          },
          error: (error) => {
            console.error('Error loading selection process:', error);
          }
        });
    }

    this.candidatingForm = this._fb.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      cpf: ['', [Validators.required, Validators.pattern(/^\d{11}$/)]],
      phone: ['', Validators.required],
      cep: ['', Validators.required],
      state: [''],
      city: [''],
      neighborhood: [''],
      street: [''],
      number: ['', Validators.required],
      marital_status: ['', Validators.required],
      process: [selectionProcessId],
      attachments: []
    });
  }

  searchCEP() {
    const cep = this.candidatingForm.get('cep')?.value;
    if (cep && cep.length === 8) {
      this.http.get<any>(`https://viacep.com.br/ws/${cep}/json/`).subscribe({
        next: (data) => {
          if (!data.erro) {
            this.candidatingForm.patchValue({
              state: data.uf,
              city: data.localidade,
              neighborhood: data.bairro,
              street: data.logradouro
            });
          } else {
            alert('CEP não encontrado.');
          }
        },
        error: () => alert('Erro ao consultar o CEP.')
      });
    } else {
      alert('CEP inválido.');
    }
  }
  
  submitApplication() {
    if (this.candidatingForm.valid) {
      const formData = this.candidatingForm.value;
      console.log('Dados enviados:', formData);
      alert('Candidatura enviada com sucesso!');
    } else {
      alert('Por favor, preencha todos os campos obrigatórios.');
    }
  }
}
