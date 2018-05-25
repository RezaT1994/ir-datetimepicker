# ir-datetimepicker
Angular 6 persian datetime picker

## Usage

1. Install from npm:
```
npm install ir-datetimepicker --save
```

2. Import **IrDateTimePickerModule** to app.module.ts:
```javascript
import { IrDateTimePickerModule } from 'ir-datetimepicker';
@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        IrDateTimePickerModule
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
```

3. Now use this in your html:
```html
<ir-datetimepicker></ir-datetimepicker>
```

## Attributes
| Attr | Type | Default | Description | Sample |
| ---- | :----: | :-------: | ----------- | ------ |
| placeholder | string | '' | Placeholder for the text input | [placeholder]="'تاریخ'" |
| showTimer | boolean | false | Show timer with date | [showTimer]="true" |
| justTime | boolean | false | Show just timer and hides date | [justTime]="true" |
| readonly | boolean | false | Make the input readonly | [readonly]="true" |
| disableBeforeToday | boolean | false | Disable use from selecting date before today | [disableBeforeToday]="true" |
| (ngModel) | string | '' | You can also use ngModel | [(ngModel)]="1397/01/23" |

## Events
| Event | Description | Sample |
| ----- | ----------- | ------ |
| onchange() | Change event that trigger on input and date selection | (onchange)="changeDate($event)" |

`$event` contains these keys:

| Key | Description |
| --- | ----------- |
| jDate | Jalali Date |
| gDate | Gregorian Date |
| time | Time |
| fullDate | Full date with time |
| invalid | If the date input is invalid it will be false |
