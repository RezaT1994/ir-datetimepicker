import { NgModule } from '@angular/core';
import { IrDatetimepickerComponent } from './ir-datetimepicker.component';
import { FormsModule } from '@angular/forms';
import { IrDateTimepickerContentComponent } from '../content/ir-datetimepicker-content';
import { CommonModule } from '@angular/common';
import {
	MatButtonModule,
	MatIconModule,
	MatInputModule,
	MatDialogModule,
	MatTooltipModule
} from '@angular/material';

@NgModule({
	imports: [
		FormsModule,
		MatButtonModule,
		MatIconModule,
		MatInputModule,
		MatDialogModule,
		MatTooltipModule,
		CommonModule
	],
	declarations: [IrDatetimepickerComponent, IrDateTimepickerContentComponent],
	exports: [IrDatetimepickerComponent],
	entryComponents: [IrDateTimepickerContentComponent]
})
export class IrDateTimePickerModule { }
