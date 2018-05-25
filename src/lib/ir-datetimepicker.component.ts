import { Component, Input, Output, ViewChild, EventEmitter, Inject, ElementRef, forwardRef } from '@angular/core';
import { MatDialog } from '@angular/material';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

import { IrDateTimepickerContent } from '../content/ir-datetimepicker-content';

import { Jalali } from '../class/Jalali';

const noop = () => {
};

export const IR_DATETIMEPICKER_VALUE_ACCESSOR: any = {
	provide: NG_VALUE_ACCESSOR,
	useExisting: forwardRef(() => IrDatetimepickerComponent),
	multi: true
};

@Component({
	selector: 'ir-datetimepicker',
	templateUrl: 'ir-datetimepicker.component.html',
	styleUrls: ['ir-datetimepicker.component.scss'],
	providers: [IR_DATETIMEPICKER_VALUE_ACCESSOR]
})
export class IrDatetimepickerComponent implements ControlValueAccessor {
	jalali: Jalali = new Jalali;
	@Input() placeholder: string;
	@Input() showTimer: boolean = false;
	@Input() justTime: boolean = false;
	@Input() readonly: boolean = false;
	@Input() disableBeforeToday: boolean = false;
	@Input() class: string = '';
	@ViewChild('IrInput') IrInput: ElementRef;
	@Output() onchange: EventEmitter<any> = new EventEmitter<any>();

	private innerValue: any = '';

	private onTouchedCallback: () => void = noop;
	private onChangeCallback: (_: any) => void = noop;

	get value(): any {
		return this.innerValue;
	};

	set value(v: any) {
		if (v !== this.innerValue) {
			this.innerValue = v;
			this.onChangeCallback(v);
		}
	}

	onBlur() {
		this.onTouchedCallback();
	}

	writeValue(value: any) {
		if (value !== this.innerValue) {
			this.innerValue = value;
		}
	}

	registerOnChange(fn: any) {
		this.onChangeCallback = fn;
	}

	registerOnTouched(fn: any) {
		this.onTouchedCallback = fn;
	}

	constructor(private dialog: MatDialog) {

	}

	keyup() {
		let event: any = {};
		let invalid = false;

		if (this.value != '' && this.value != null) {
			if (!this.justTime) {
				let jdate: any = '';
				let time: any = '';
				if (this.showTimer) {
					if (/^(^1([0-9]){3}\/([0-9]){2}\/([0-9]){2}\s([0-9]){2}\:([0-9]){2})$/g.exec(this.value) != null) {
						let date = this.value.split(' ');
						jdate = date[0].split('/');
						time = date[1].split(':');
					}
				} else {
					if (/^(^1([0-9]){3}\/([0-9]){2}\/([0-9]){2})$/g.exec(this.value) != null) {
						jdate = this.value.split('/');
					}
				}

				if (jdate != '') {
					let gdate: any = this.jalali.toGregorian(parseInt(jdate[0]), parseInt(jdate[1]), parseInt(jdate[2]));
					event.jDate = `${jdate[0]}/${(jdate[1].toString().length == 1) ? '0' + jdate[1] : jdate[1]}/${(jdate[2].toString().length == 1) ? '0' + jdate[2] : jdate[2]}`;
					event.gDate = `${gdate.gy}-${(gdate.gm.toString().length == 1) ? '0' + gdate.gm : gdate.gm}-${(gdate.gd.toString().length == 1) ? '0' + gdate.gd : gdate.gd}`;

					if (this.disableBeforeToday) {
						let todayDate = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
						let inputDate = new Date(parseInt(gdate.gy), parseInt(gdate.gm) - 1, parseInt(gdate.gd))

						if (inputDate.getTime() - todayDate.getTime() < 0) {
							invalid = true;
						}
					}

					if (invalid == false) {
						if (time != '') {
							event.time = `${(time[0].toString().length == 1) ? '0' + time[0] : time[0]}:${(time[1].toString().length == 1) ? '0' + time[1] : time[1]}:00`;
							event.fullDate = `${event.gDate}T${event.time}.000Z`;
						} else {
							event.fullDate = `${event.gDate}T00:00:00.000Z`;
						}
					}
				}
			} else {
				if (/^(([0-9]){2}\:([0-9]){2})$/g.exec(this.value) != null) {
					let time = this.value.split(':');
					event.time = `${(time[0].toString().length == 1) ? '0' + time[0] : time[0]}:${(time[1].toString().length == 1) ? '0' + time[1] : time[1]}:00`;
				}
			}
		} else {
			event.fullDate = '';
			event.jDate = '';
			event.gDate = '';
			event.time = '';
		}

		if (invalid == true) {
			event = { invalid: true };
		} else {
			event.invalid = false;
		}

		this.onchange.emit(event);
	}

	ngOnInit() {
		if (this.showTimer)
			this.justTime = false;
	}

	openDialog(): void {
		if (this.value != '' && this.value != null) {
			if (!this.justTime) {
				if (this.showTimer) {
					if (/^(^1([0-9]){3}\/([0-9]){2}\/([0-9]){2}\s([0-9]){2}\:([0-9]){2})$/g.exec(this.value) == null) {
						let today = new Date();
						let persianDate = this.jalali.toJalaali(today.getFullYear(), today.getMonth() + 1, today.getDate());
						this.value = `${persianDate.jy}/${(persianDate.jm.toString().length == 1) ? '0' + persianDate.jm : persianDate.jm.toString()}/${(persianDate.jd.toString().length == 1) ? '0' + persianDate.jd : persianDate.jd.toString()} ${(today.getHours().toString().length == 1) ? '0' + today.getHours() : today.getHours().toString()}:${(today.getMinutes().toString().length == 1) ? '0' + today.getMinutes() : today.getMinutes().toString()}`;
					}
				} else {
					if (/^(^1([0-9]){3}\/([0-9]){2}\/([0-9]){2})$/g.exec(this.value) == null) {
						let today = new Date();
						let persianDate = this.jalali.toJalaali(today.getFullYear(), today.getMonth() + 1, today.getDate());
						this.value = `${persianDate.jy}/${(persianDate.jm.toString().length == 1) ? '0' + persianDate.jm : persianDate.jm.toString()}/${(persianDate.jd.toString().length == 1) ? '0' + persianDate.jd : persianDate.jd.toString()}`;
					}
				}
			} else {
				if (/^(([0-9]){2}\:([0-9]){2})$/g.exec(this.value) == null) {
					let today = new Date();
					let persianDate = this.jalali.toJalaali(today.getFullYear(), today.getMonth() + 1, today.getDate());
					this.value = `${(today.getHours().toString().length == 1) ? '0' + today.getHours() : today.getHours().toString()}:${(today.getMinutes().toString().length == 1) ? '0' + today.getMinutes() : today.getMinutes().toString()}`;
				}
			}
		}

		let dialogRef = this.dialog.open(IrDateTimepickerContent, {
			width: '360px',
			data: { inputDate: this.value, showTimer: this.showTimer, justTime: (this.showTimer) ? false : this.justTime, disableBeforeToday: this.disableBeforeToday }
		});

		dialogRef.afterClosed().subscribe(result => {
			if (result !== undefined) {
				this.value = result;

				let event: any = {};
				let invalid = false;
				if (!this.justTime) {
					let jdate;
					let time: any = '';
					if (this.showTimer) {
						if (/^(^1([0-9]){3}\/([0-9]){2}\/([0-9]){2}\s([0-9]){2}\:([0-9]){2})$/g.exec(this.value) != null) {
							let date = this.value.split(' ');
							jdate = date[0].split('/');
							time = date[1].split(':');
						}
					} else {
						if (/^(^1([0-9]){3}\/([0-9]){2}\/([0-9]){2})$/g.exec(this.value) != null) {
							jdate = this.value.split('/');
						}
					}

					if (jdate != '') {
						let gdate: any = this.jalali.toGregorian(parseInt(jdate[0]), parseInt(jdate[1]), parseInt(jdate[2]));
						event.jDate = `${jdate[0]}/${(jdate[1].toString().length == 1) ? '0' + jdate[1] : jdate[1]}/${(jdate[2].toString().length == 1) ? '0' + jdate[2] : jdate[2]}`;
						event.gDate = `${gdate.gy}-${(gdate.gm.toString().length == 1) ? '0' + gdate.gm : gdate.gm}-${(gdate.gd.toString().length == 1) ? '0' + gdate.gd : gdate.gd}`;

						if (this.disableBeforeToday) {
							let todayDate = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
							let inputDate = new Date(parseInt(gdate.gy), parseInt(gdate.gm) - 1, parseInt(gdate.gd))

							if (inputDate.getTime() - todayDate.getTime() < 0) {
								invalid = true;
							}
						}

						if (invalid == false) {
							if (time != '') {
								event.time = `${(time[0].toString().length == 1) ? '0' + time[0] : time[0]}:${(time[1].toString().length == 1) ? '0' + time[1] : time[1]}:00`;
								event.fullDate = `${event.gDate}T${event.time}.000Z`;
							} else {
								event.fullDate = `${event.gDate}T00:00:00.000Z`;
							}
						}
					}
				} else {
					if (/^(([0-9]){2}\:([0-9]){2})$/g.exec(this.value) != null) {
						let time = this.value.split(':');
						event.time = `${(time[0].toString().length == 1) ? '0' + time[0] : time[0]}:${(time[1].toString().length == 1) ? '0' + time[1] : time[1]}:00`;
					}
				}

				if (invalid == true) {
					event = { invalid: true };
				} else {
					event.invalid = false;
				}

				this.onchange.emit(event);
			}
		});
	}
}
