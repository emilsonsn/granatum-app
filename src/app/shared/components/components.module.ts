import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AccountManagerComponent} from "@shared/components/account-manager/account-manager.component";
import {LottieComponent} from "ngx-lottie";
import {
  SmallInformationCardComponent
} from "@shared/components/small-information-card/small-information-card.component";
import {MatDivider} from "@angular/material/divider";
import {KanbanComponent} from "@shared/components/kanban/kanban.component";
import {CdkDrag, CdkDragPlaceholder, CdkDropList, CdkDropListGroup} from "@angular/cdk/drag-drop";
import { NgxEditorModule, NgxEditorService } from 'ngx-editor';
import { EditorComponent } from './editor/editor.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ComponentHeaderComponent } from './component-header/component-header.component';

const components: any[] = [
  AccountManagerComponent,
  SmallInformationCardComponent,
  KanbanComponent,
  EditorComponent,
  ComponentHeaderComponent,
]

@NgModule({
  declarations: components,
  imports: [
    CommonModule,
    LottieComponent,
    NgxEditorModule,
    FormsModule,
    ReactiveFormsModule,
    MatDivider,
    CdkDropListGroup,
    CdkDropList,
    CdkDrag,
    CdkDragPlaceholder,
  ],
  exports: components
})
export class ComponentsModule { }
