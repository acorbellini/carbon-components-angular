import {
	TemplateRef,
	Component,
	ViewChild,
	OnInit,
	Input
} from "@angular/core";
import { TableModel } from "../table-model.class";
import { TableHeaderItem } from "../table-header-item.class";
import { TableItem } from "../table-item.class";

@Component({
	selector: "app-pagination-table",
	template: `
		<ng-template #paginationTableItemTemplate let-data="data">
			<a [attr.href]="data.link">{{data.name}} {{data.surname}}</a>
		</ng-template>
		<ng-template #filterableHeaderTemplate let-data="data">
			<i><a [attr.href]="data.link">{{data.name}}</a></i>
		</ng-template>
		<ng-template #filter let-popover="popover" let-filter="data">
			<ibm-label class="first-label">
				Value
				<input type="text" [(ngModel)]="filter1" class="input-field">
				<button class="btn--primary" (click)="filter.data = filter1; popover.doClose()">Apply</button>
				<button class="btn--secondary" (click)="popover.doClose()">Cancel</button>
			</ibm-label>
		</ng-template>

		<ibm-table
			style="display: block; width: 650px;"
			[skeleton]="skeleton"
			[model]="model"
			(sort)="paginationSort($event)">
		</ibm-table>
		<ibm-pagination [model]="model" (selectPage)="selectPage($event)"></ibm-pagination>
	`
})
export class PaginationTableStory implements OnInit {
	@Input() model = new TableModel();

	@Input() skeleton = false;

	@Input() get totalDataLength() {
		return this.model.totalDataLength;
	}
	set totalDataLength(value) {
		this.model.totalDataLength = value;
	}

	@ViewChild("filter")
	filter: TemplateRef<any>;
	@ViewChild("filterableHeaderTemplate")
	protected filterableHeaderTemplate: TemplateRef<any>;
	@ViewChild("paginationTableItemTemplate")
	protected paginationTableItemTemplate: TemplateRef<any>;

	ngOnInit() {
		this.model.data = [[]];
		this.model.header = [
			new TableHeaderItem({ data: "Very long title indeed" }),
			new TableHeaderItem({
				data: "Very long title indeed",
				style: { "width": "auto" }
			})
		];

		this.model.pageLength = 10;
		this.model.totalDataLength = 105;
		this.selectPage(1);
	}

	customSort(index: number) {
		this.sort(this.model, index);
	}

	sort(model, index: number) {
		if (model.header[index].sorted) {
			// if already sorted flip sorting direction
			model.header[index].ascending = model.header[index].descending;
		}
		model.sort(index);
	}

	getPage(page: number) {
		const line = line => [`Item ${line}:1!`, { name: "Item", surname: `${line}:2` }];

		const fullPage = [];

		for (let i = (page - 1) * this.model.pageLength; i < page * this.model.pageLength && i < this.model.totalDataLength; i++) {
			fullPage.push(line(i + 1));
		}

		return new Promise(resolve => {
			setTimeout(() => resolve(fullPage), 150);
		});
	}

	selectPage(page) {
		this.getPage(page).then((data: Array<Array<any>>) => {
			// set the data and update page
			this.model.data = this.prepareData(data);
			this.model.currentPage = page;
		});
	}

	protected prepareData(data: Array<Array<any>>) {
		// create new data from the service data
		let newData = [];
		data.forEach(dataRow => {
			let row = [];
			dataRow.forEach(dataElement => {
				row.push(new TableItem({
					data: dataElement,
					template: typeof dataElement === "string" ? undefined : this.paginationTableItemTemplate
					// your template can handle all the data types so you don't have to conditionally set it
					// you can also set different templates for different columns based on index
				}));
			});
			newData.push(row);
		});
		return newData;
	}
}
