import {
	TemplateRef,
	Component,
	ViewChild,
	OnInit,
	Input
} from "@angular/core";
import { TableModel } from "../table-model.class";
import { TableItem } from "../table-item.class";
import { TableHeaderItem } from "../table-header-item.class";

class CustomHeaderItem extends TableHeaderItem {
	// used for custom sorting
	compare(one: TableItem, two: TableItem) {
		const stringOne = (one.data.name || one.data.surname || one.data).toLowerCase();
		const stringTwo = (two.data.name || two.data.surname || two.data).toLowerCase();

		if (stringOne > stringTwo) {
			return 1;
		} else if (stringOne < stringTwo) {
			return -1;
		} else {
			return 0;
		}
	}
}

@Component({
	selector: "app-expansion-table",
	template: `
		<ng-template #customTableItemTemplate let-data="data">
			<a [attr.href]="data.link">{{data.name}} {{data.surname}}</a>
		</ng-template>
		<ng-template #customHeaderTemplate let-data="data">
			<i><a [attr.href]="data.link">{{data.name}}</a></i>
		</ng-template>

		<ibm-table
			style="display: block; width: 650px;"
			[model]="model"
			[size]="size"
			[showSelectionColumn]="showSelectionColumn"
			[skeleton]="skeleton"
			[striped]="striped"
			(sort)="customSort($event)"
			[isDataGrid]="isDataGrid">
		</ibm-table>
	`
})
export class ExpansionTableStory implements OnInit {
	@Input() model = new TableModel();
	@Input() size = "md";
	@Input() showSelectionColumn = true;
	@Input() striped = true;
	@Input() isDataGrid = false;
	@Input() skeleton = false;

	@ViewChild("customHeaderTemplate")
	protected customHeaderTemplate: TemplateRef<any>;
	@ViewChild("customTableItemTemplate")
	protected customTableItemTemplate: TemplateRef<any>;

	ngOnInit() {
		this.model.data = [
			[
				new TableItem({ data: "Name 1", expandedData: "No template" }),
				new TableItem({ data: { name: "Lessy", link: "#" }, template: this.customTableItemTemplate })
			],
			[
				new TableItem({
					data: "Name 3",
					expandedData: { name: "In", surname: "Template" },
					expandedTemplate: this.customTableItemTemplate
				}),
				new TableItem({ data: "swer" })
			],
			[new TableItem({ data: "Name 2" }), new TableItem({ data: { name: "Alice", surname: "Bob" }, template: this.customTableItemTemplate })],
			[new TableItem({ data: "Name 4" }), new TableItem({ data: "twer" })]
		];
		this.model.header = [
			new TableHeaderItem({ data: "Very long title indeed" }),
			new CustomHeaderItem({
				data: { name: "Custom header", link: "#" },
				template: this.customHeaderTemplate,
				style: { "width": "auto" }
			})
		];
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
}
