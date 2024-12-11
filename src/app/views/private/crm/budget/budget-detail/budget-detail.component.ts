import { ActivatedRoute, Router } from '@angular/router';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BudgetDetailService } from '@services/crm/budget-detail.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-budget-detail',
  templateUrl: './budget-detail.component.html',
  styleUrl: './budget-detail.component.scss'
})
export class BudgetDetailComponent {

  public form: FormGroup;

  public loading: boolean = false;

  constructor(
    private readonly _fb: FormBuilder,
    private readonly _toastr: ToastrService,
    private readonly _budgetDetailService: BudgetDetailService,
    private readonly _router: Router,
    private readonly _route: ActivatedRoute
  ) {
  }

  ngOnInit(): void {

    this.form = this._fb.group({
      id: [null],
      presentation_text_1: [null],
      presentation_text_2: [null],
      presentation_text_3: [null],

      development_text_1: [null],
      development_text_2: [null],
      development_text_3: [null],
      development_text_4: [null],

      payment_methods: [null],

      conclusion_text_1: [null],
      conclusion_text_2: [null],
    })

    const id = this._route.snapshot.paramMap.get('id');
    this.getDetails(id);

  }

  public getDetails(id){
    this._budgetDetailService.getById(id)
    .subscribe({
      next: (res) => {
        this.form.patchValue(res);
        if (res.cover) {
          this.images["cover"] = res.cover
        }
        if (res.final_cover) {
          this.images["final_cover"] = res.final_cover
        }
        if (res.presentation_image_1) {
          this.images["presentation_image_1"] = res.presentation_image_1
        }
        if (res.presentation_image_2) {
          this.images["presentation_image_2"] = res.presentation_image_2
        }
        if (res.presentation_image_3) {
          this.images["presentation_image_3"] = res.presentation_image_3
        }
        if (res.development_image_1) {
          this.images["development_image_1"] = res.development_image_1
        }
        if (res.development_image_2) {
          this.images["development_image_2"] = res.development_image_2
        }
        if (res.development_image_3) {
          this.images["development_image_3"] = res.development_image_3
        }
        if (res.development_image_4) {
          this.images["development_image_4"] = res.development_image_4
        }
        if (res.conclusion_image_1) {
          this.images["conclusion_image_1"] = res.conclusion_image_1
        }
        if (res.conclusion_image_2) {
          this.images["conclusion_image_2"] = res.conclusion_image_2
        }
      },
      error: (error) => {
        this._toastr.error(error.error.message);
      }
    });
  }

  isDragOver: boolean = false;

  files = {
    presentation_image_1: null,
    presentation_image_2: null,
    presentation_image_3: null,
    development_image_1: null,
    development_image_2: null,
    development_image_3: null,
    development_image_4: null,
    conclusion_image_1: null,
    conclusion_image_2: null,
    cover: null,
    final_cover: null
  }

  images = {
    presentation_image_1: null,
    presentation_image_2: null,
    presentation_image_3: null,
    development_image_1: null,
    development_image_2: null,
    development_image_3: null,
    development_image_4: null,
    conclusion_image_1: null,
    conclusion_image_2: null,
    cover: null,
    final_cover: null
  }

  private _initOrStopLoading(): void {
    this.loading = !this.loading;
  }

  onFileSelected(type: string, event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {

      this.files[type] = file

      const reader = new FileReader();
      reader.onload = () => {
         this.images[type] = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  triggerFileInput(type: string): void {
    const fileInput = document.getElementById(type) as HTMLInputElement;
    fileInput.click();
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent): void {
    this.isDragOver = false;
  }

  onDrop(type: string, event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = false;

    const file = event.dataTransfer?.files[0];
    if (file) {

      this.files[type] = file

      const reader = new FileReader();
      reader.onload = () => {
        this.images[type] = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage(type: string, event: Event): void {
    event.stopPropagation();
    this.images[type] = null;
  }

  protected setDescription(text_type: string , html: string) {
    debugger
    this.form.patchValue({ [text_type]: html });
  }

  public onSubmit(form: FormGroup): void {
    if (!form.valid) {
      form.markAllAsTouched();
    } else {

      const formData = new FormData();
      formData.append('id', form.get('id')?.value);
      formData.append('presentation_text_1', form.get('presentation_text_1')?.value);
      formData.append('presentation_text_2', form.get('presentation_text_2')?.value);
      formData.append('presentation_text_3', form.get('presentation_text_3')?.value);

      formData.append('development_text_1', form.get('development_text_1')?.value);
      formData.append('development_text_2', form.get('development_text_2')?.value);
      formData.append('development_text_3', form.get('development_text_3')?.value);
      formData.append('development_text_4', form.get('development_text_4')?.value);

      formData.append('payment_methods', form.get('payment_methods')?.value);

      formData.append('conclusion_text_1', form.get('conclusion_text_1')?.value);
      formData.append('conclusion_text_2', form.get('conclusion_text_2')?.value);

      if(this.files['presentation_image_1']){
        formData.append('presentation_image_1', this.files['presentation_image_1']);
      }

      if(this.files['presentation_image_2']){
        formData.append('presentation_image_2', this.files['presentation_image_2']);
      }

      if(this.files['presentation_image_3']){
        formData.append('presentation_image_3', this.files['presentation_image_3']);
      }

      if(this.files['development_image_1']){
        formData.append('development_image_1', this.files['development_image_1']);
      }

      if(this.files['development_image_2']){
        formData.append('development_image_2', this.files['development_image_2']);
      }

      if(this.files['development_image_3']){
        formData.append('development_image_3', this.files['development_image_3']);
      }

      if(this.files['development_image_4']){
        formData.append('development_image_4', this.files['development_image_4']);
      }

      if(this.files['conclusion_image_1']){
        formData.append('conclusion_image_1', this.files['conclusion_image_1']);
      }

      if(this.files['conclusion_image_2']){
        formData.append('conclusion_image_2', this.files['conclusion_image_2']);
      }

      if(this.files['cover']){
        formData.append('cover', this.files['cover']);
      }

      if(this.files['final_cover']){
        formData.append('final_cover', this.files['final_cover']);
      }

      this._pathBudgetDetail(formData);
    }
  }

  private _pathBudgetDetail(res: any) {
    this._initOrStopLoading();
    this._budgetDetailService.update(res.get('id'), res).subscribe({
      next: () => {
        this._toastr.success("Detalhe do orçamento criado com sucesso!");
        this._initOrStopLoading();
        this._router.navigate(['/painel/crm/budget']);
      },
      error: (error) => {
        this._toastr.error("Erro ao criar o orçamento.");
        console.error(error);
        this._initOrStopLoading();
      }
    });
  }

}
