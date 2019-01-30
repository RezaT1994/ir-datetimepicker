import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { Jalali } from '../class/Jalali';

@Component({
	selector: 'lib-ir-datetimepicker-content',
	templateUrl: 'ir-datetimepicker-content.html',
	styleUrls: ['ir-datetimepicker-content.scss']
})
export class IrDateTimepickerContentComponent {
	jalali: Jalali = new Jalali;
	todayDateTimeString: string;
	persianTodayDateTemp = null;
	persianInputDateTemp = null;
	currentYearNumber = null;
	currentMonthNumber = null;
	currentDayNumber = null;
	currentHourNumber = null;
	currentMinuteNumber = null;
	TitleMonth = '';
	TitleYear = '';
	dayCels: any[] = [];
	dayRows: any[] = [];
	selectMonth = false;
	inputDate = '';
	months: any[] = [
		[
			{
				text: 'فروردین',
				disabled: false
			},
			{
				text: 'اردیبهشت',
				disabled: false
			},
			{
				text: 'خرداد',
				disabled: false
			}
		], [
			{
				text: 'تیر',
				disabled: false
			},
			{
				text: 'مرداد',
				disabled: false
			},
			{
				text: 'شهریور',
				disabled: false
			}
		], [
			{
				text: 'مهر',
				disabled: false
			},
			{
				text: 'آبان',
				disabled: false
			},
			{
				text: 'آذر',
				disabled: false
			}
		], [
			{
				text: 'دی',
				disabled: false
			},
			{
				text: 'بهمن',
				disabled: false
			},
			{
				text: 'اسفند',
				disabled: false
			}
		]];
	showTimer = false;
	justTime = false;
	disableBeforeToday = false;
	selectTime = false;
	hour12: any[] = [];
	hour24: any[] = [];
	minute: any[] = [];
	showHour = true;
	disablePrevMonth = false;
	disablePrevYear = false;

	constructor(public dialogRef: MatDialogRef<IrDateTimepickerContentComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
		this.inputDate = (data.inputDate !== undefined && data.inputDate != null) ? data.inputDate.trim() : '';
		this.showTimer = (data.showTimer !== undefined && data.showTimer != null) ? data.showTimer : false;
		this.justTime = (data.justTime !== undefined && data.justTime != null) ? data.justTime : false;
		this.disableBeforeToday = (data.disableBeforeToday !== undefined && data.disableBeforeToday != null) ? data.disableBeforeToday : false;
		if (this.justTime) {
			this.selectTime = true;
		}
		this.persianTodayDateTemp = this.getTodayCalendarInPersian();
		if (this.inputDate !== '') {
			this.persianInputDateTemp = this.getInputDateInPersian();
		}
		this.currentYearNumber = (this.persianInputDateTemp == null) ? this.persianTodayDateTemp[0] : this.persianInputDateTemp[0];
		this.currentMonthNumber = (this.persianInputDateTemp == null) ? this.persianTodayDateTemp[1] : this.persianInputDateTemp[1];
		this.currentDayNumber = (this.persianInputDateTemp == null) ? this.persianTodayDateTemp[2] : this.persianInputDateTemp[2];
		this.currentHourNumber = (this.persianInputDateTemp == null) ? this.persianTodayDateTemp[3] : this.persianInputDateTemp[3];
		this.currentMinuteNumber = (this.persianInputDateTemp == null) ? this.persianTodayDateTemp[4] : this.persianInputDateTemp[4];

		this.todayDateTimeString = 'امروز: ' + this.persianTodayDateTemp[2] + ' ' +
		this.getPersianMonth(this.persianTodayDateTemp[1]) + ' ' + this.persianTodayDateTemp[0];

		if (
			this.disableBeforeToday &&
			this.currentYearNumber === parseInt(this.persianTodayDateTemp[0], 0) &&
			this.currentMonthNumber === parseInt(this.persianTodayDateTemp[1], 0)) {
			this.disablePrevMonth = true;
		}

		if (this.disableBeforeToday && this.currentYearNumber === parseInt(this.persianTodayDateTemp[0], 0)) {
			this.disablePrevYear = true;

			for (let i = 0; i < parseInt(this.persianTodayDateTemp[1], 0) - 1; i++) {
				let b = 0;
				if (i >= 9) {
					b = 3;
				} else if (i >= 6) {
					b = 2;
				} else if (i >= 3) {
					b = 1;
				}
				this.months[b][(b === 0) ? i : i - (b * 3)].disabled = true;
			}
		}

		let radian;
		for (let i = 1; i < 13; i++) {
			radian = i / 6 * Math.PI;

			this.hour12.push({
				text: i.toString(),
				top: 120 - Math.cos(radian) * 80 - 35 + 55,
				right: 120 - Math.sin(radian) * 80 - 35 + 55
			});
		}

		for (let i = 1; i < 13; i++) {
			radian = i / 6 * Math.PI;

			this.hour24.push({
				text: (i + 12 === 24) ? '00' : (i + 12).toString(),
				top: 170 - Math.cos(radian) * 130 - 28,
				right: 170 - Math.sin(radian) * 130 - 28
			});
		}

		for (let i = 0; i < 60; i += 5) {
			radian = i / 30 * Math.PI;

			this.minute.push({
				text: (i === 0) ? '00' : i.toString(),
				top: 170 - Math.cos(radian) * 130 - 28,
				right: 170 - Math.sin(radian) * 130 - 28
			});
		}

		this.createHTML();
	}

	selectTimer() {
		this.selectTime = !this.selectTime;
	}

	selectHour(h) {
		this.showHour = !this.showHour;

		this.currentHourNumber = (h.length === 1) ? '0' + h : h;
	}

	selectMinute(m) {
		this.showHour = !this.showHour;

		this.currentMinuteNumber = (m.length === 1) ? '0' + m : m;
	}

	switchView() {
		this.selectMonth = !this.selectMonth;

		if (
			this.disableBeforeToday &&
			(this.currentYearNumber !== parseInt(this.persianTodayDateTemp[0], 0) ||
			this.currentMonthNumber !== parseInt(this.persianTodayDateTemp[1], 0))) {
			this.disablePrevMonth = false;
		}

		if (this.disableBeforeToday && (this.currentYearNumber !== parseInt(this.persianTodayDateTemp[0], 0))) {
			this.disablePrevYear = false;
		}
	}

	changeMonth(month) {
		this.currentMonthNumber = month;
		this.switchView();

		this.createHTML();
	}

	submitTime() {
		if (this.justTime) {
			this.dialogRef.close(`${(this.currentHourNumber.toString().length === 1) ? '0' +
			this.currentHourNumber : this.currentHourNumber}:${(this.currentMinuteNumber.toString().length === 1) ? '0' +
			this.currentMinuteNumber : this.currentMinuteNumber}`);
		} else {
			this.selectTime = !this.selectTime;
		}
	}

	changeDate(day) {
		if (this.showTimer) {
			this.dialogRef.close(`${this.currentYearNumber}/${(this.currentMonthNumber.toString().length === 1) ? '0' +
			this.currentMonthNumber : this.currentMonthNumber}/${(day.toString().length === 1) ? '0' +
			day : day} ${(this.currentHourNumber.toString().length === 1) ? '0' +
			this.currentHourNumber : this.currentHourNumber}:${(this.currentMinuteNumber.toString().length === 1) ? '0' +
			this.currentMinuteNumber : this.currentMinuteNumber}`);
		} else {
			this.dialogRef.close(`${this.currentYearNumber}/${(this.currentMonthNumber.toString().length === 1) ? '0' +
			this.currentMonthNumber : this.currentMonthNumber}/${(day.toString().length === 1) ? '0' + day : day}`);
		}
	}

	selectToday() {
		this.currentYearNumber = this.persianTodayDateTemp[0];
		this.currentMonthNumber = this.persianTodayDateTemp[1];
		this.currentDayNumber = this.persianTodayDateTemp[2];
		this.currentHourNumber = this.persianTodayDateTemp[3];
		this.currentMinuteNumber = this.persianTodayDateTemp[4];

		if (this.showTimer) {
			this.dialogRef.close(`${this.currentYearNumber}/${(this.currentMonthNumber.toString().length === 1) ? '0' +
			this.currentMonthNumber : this.currentMonthNumber}/${(this.currentDayNumber.toString().length === 1) ? '0' +
			this.currentDayNumber : this.currentDayNumber} ${(this.currentHourNumber.toString().length === 1) ? '0' +
			this.currentHourNumber : this.currentHourNumber}:${(this.currentMinuteNumber.toString().length === 1) ? '0' +
			this.currentMinuteNumber : this.currentMinuteNumber}`);
		} else {
			this.dialogRef.close(`${this.currentYearNumber}/${(this.currentMonthNumber.toString().length === 1) ? '0' +
			this.currentMonthNumber : this.currentMonthNumber}/${(this.currentDayNumber.toString().length === 1) ? '0' +
			this.currentDayNumber : this.currentDayNumber}`);
		}
	}

	createHTML() {
		this.dayCels = [];
		this.dayRows = [];

		let numberOfDaysInCurrentMonth = 31;
		if (this.currentMonthNumber > 6 && this.currentMonthNumber < 12) {
			numberOfDaysInCurrentMonth = 30;
		} else if (this.currentMonthNumber === 12) {
			numberOfDaysInCurrentMonth = this.isLeapYear(this.currentYearNumber) ? 30 : 29;
		}

		this.TitleMonth = this.getPersianMonth(this.currentMonthNumber);
		this.TitleYear = this.currentYearNumber;

		const firstWeekDayNumber = this.getFirstDayOfWeek(this.currentYearNumber, this.currentMonthNumber);

		let tdNumber = 0;
		if (firstWeekDayNumber !== 1) {
			for (let i = firstWeekDayNumber - 2; i >= 0; i--) {
				this.dayCels.push({text: ''});
				tdNumber++;
			}
		}

		for (let i = 1; i <= numberOfDaysInCurrentMonth; i++) {
			if (tdNumber >= 7) {
				tdNumber = 0;

				this.dayRows.push(this.dayCels);
				this.dayCels = [];
			}

			if (
				this.disableBeforeToday &&
				this.currentYearNumber === parseInt(this.persianTodayDateTemp[0], 0) &&
				this.currentMonthNumber === parseInt(this.persianTodayDateTemp[1], 0) &&
				parseInt(this.persianTodayDateTemp[2], 0) > i) {
				this.dayCels.push({text: i, disabled: true});
			} else {
				this.dayCels.push({text: i});
			}

			tdNumber++;
		}

		if (this.dayCels.length !== 0) {
			this.dayRows.push(this.dayCels);
		}
	}

	getInputDateInPersian() {
		let jdate;
		let tt;
		if (this.justTime) {
			tt = this.inputDate.split(':');
		} else {
			if (this.showTimer) {
				const dd = this.inputDate.split(' ');
				jdate = dd[0].split('/');
				tt = dd[1].split(':');
			} else {
				jdate = this.inputDate.split('/');
			}
		}

		let date;
		if (this.justTime) {
			date = new Date();
		} else {
			const gdate = this.jalali.toGregorian(parseInt(jdate[0], 0), parseInt(jdate[1], 0), parseInt(jdate[2], 0));
			date = new Date(gdate.gy, gdate.gm - 1, gdate.gd);
		}
		const persianDate = this.jalali.toJalaali(date.getFullYear(), date.getMonth() + 1, date.getDate());

		if (this.showTimer || this.justTime) {
			return [persianDate.jy, persianDate.jm, persianDate.jd, tt[0], tt[1]];
		} else {
			return [persianDate.jy, persianDate.jm, persianDate.jd];
		}
	}

	getTodayCalendarInPersian() {
		const today = new Date(),
			persianDate = this.jalali.toJalaali(today.getFullYear(), today.getMonth() + 1, today.getDate());
		return [persianDate.jy, persianDate.jm, persianDate.jd, (today.getHours().toString().length === 1) ? '0' +
			today.getHours() : today.getHours().toString(), (today.getMinutes().toString().length === 1) ? '0' +
			today.getMinutes() : today.getMinutes().toString()];
	}

	getFirstDayOfWeek(persianYear, persianMonth) {
		const gregorianDate = this.jalali.toGregorian(persianYear, persianMonth, 1),
			date = new Date(gregorianDate.gy, gregorianDate.gm - 1, gregorianDate.gd);
		let dayOfWeek = 0;
		switch (date.getDay()) {
			case 0:
				dayOfWeek = 2; // یک شنبه
				break;

			case 1:
				dayOfWeek = 3; // دو شنبه
				break;

			case 2:
				dayOfWeek = 4; // سه شنبه
				break;

			case 3:
				dayOfWeek = 5; // چهار شنبه
				break;

			case 4:
				dayOfWeek = 6; // پنج شنبه
				break;

			case 5:
				dayOfWeek = 7; // جمعه
				break;

			case 6:
				dayOfWeek = 1; // شنبه
				break;
		}
		return dayOfWeek;
	}

	isLeapYear(persianYear) {
		return this.jalali.isLeapJalaaliYear(persianYear);
	}

	getPersianWeekDay(weekDayNumber) {
		switch (weekDayNumber) {
			case 0:
				return 'شنبه';

			case 1:
				return 'یکشنبه';

			case 2:
				return 'دوشنبه';

			case 3:
				return 'سه شنبه';

			case 4:
				return 'چهارشنبه';

			case 5:
				return 'پنج شنبه';

			case 6:
				return 'جمعه';

			default:
				return '';
		}
	}

	getPersianMonth(monthNumber) {
		switch (monthNumber) {
			case 1:
				return 'فروردین';
			case 2:
				return 'اردیبهشت';
			case 3:
				return 'خرداد';
			case 4:
				return 'تیر';
			case 5:
				return 'مرداد';
			case 6:
				return 'شهریور';
			case 7:
				return 'مهر';
			case 8:
				return 'آبان';
			case 9:
				return 'آذر';
			case 10:
				return 'دی';
			case 11:
				return 'بهمن';
			case 12:
				return 'اسفند';
			default:
				return '';
		}
	}

	increaseOneMonth() {
		this.disablePrevMonth = false;

		this.currentMonthNumber++;
		if (this.currentMonthNumber > 12) {
			this.currentMonthNumber = 1;
			this.currentYearNumber++;

			for (let i = 0; i < parseInt(this.persianTodayDateTemp[1], 0) - 1; i++) {
				let b = 0;
				if (i >= 9) {
					b = 3;
				} else if (i >= 6) {
					b = 2;
				} else if (i >= 3) {
					b = 1;
				}
				this.months[b][(b === 0) ? i : i - (b * 3)].disabled = false;
			}
		}

		this.createHTML();
	}

	increaseOneYear() {
		this.disablePrevYear = false;

		this.currentYearNumber++;

		for (let i = 0; i < parseInt(this.persianTodayDateTemp[1], 0) - 1; i++) {
			let b = 0;
			if (i >= 9) {
				b = 3;
			} else if (i >= 6) {
				b = 2;
			} else if (i >= 3) {
				b = 1;
			}
			this.months[b][(b === 0) ? i : i - (b * 3)].disabled = false;
		}

		this.createHTML();
	}

	decreaseOneMonth() {
		this.currentMonthNumber--;
		if (this.currentMonthNumber < 1) {
			this.currentMonthNumber = 12;
			this.currentYearNumber--;

			this.disablePrevYear = false;

			for (let i = 0; i < parseInt(this.persianTodayDateTemp[1], 0) - 1; i++) {
				let b = 0;
				if (i >= 9) {
					b = 3;
				} else if (i >= 6) {
					b = 2;
				} else if (i >= 3) {
					b = 1;
				}
				this.months[b][(b === 0) ? i : i - (b * 3)].disabled = true;
			}
		}

		if (
			this.disableBeforeToday &&
			this.currentYearNumber === parseInt(this.persianTodayDateTemp[0], 0) &&
			this.currentMonthNumber === parseInt(this.persianTodayDateTemp[1], 0)) {
			this.disablePrevMonth = true;
		}

		this.createHTML();
	}

	decreaseOneYear() {
		this.currentYearNumber--;

		if (this.disableBeforeToday && this.currentYearNumber === parseInt(this.persianTodayDateTemp[0], 0)) {
			this.disablePrevYear = true;

			for (let i = 0; i < parseInt(this.persianTodayDateTemp[1], 0) - 1; i++) {
				let b = 0;
				if (i >= 9) {
					b = 3;
				} else if (i >= 6) {
					b = 2;
				} else if (i >= 3) {
					b = 1;
				}
				this.months[b][(b === 0) ? i : i - (b * 3)].disabled = true;
			}

			if (this.currentMonthNumber < parseInt(this.persianTodayDateTemp[1], 0)) {
				this.currentMonthNumber = parseInt(this.persianTodayDateTemp[1], 0);
			}
		}

		this.createHTML();
	}
}
