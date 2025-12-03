import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Subscription } from "rxjs/internal/Subscription";
import { Observable } from "rxjs/internal/Observable";
import { RankingTableRow } from "extstats-core";
import {Column, DataTable, DataTableBody, DataTableController, DataTableHead} from "extstats-datatable";
import {environment} from "../environments/environment";
import {
    ButtonGroupButtonDirective,
    ButtonGroupComponent,
    DocumentationComponent,
    LoaderComponent
} from "extstats-angular";

@Component({
    selector: 'ranking-table',
    imports: [
        DataTableController,
        DataTable,
        DataTableHead,
        DataTableBody,
        DataTableBody,
        DataTableHead,
        DocumentationComponent,
        ButtonGroupComponent,
        LoaderComponent,
        ButtonGroupButtonDirective
    ],
    templateUrl: "./app.component.html"
})
export class RankingTableComponent implements OnDestroy, AfterViewInit {
    public rows: RankingTableRow[] = [];
    private subscription: Subscription | undefined;
    public columns: Column<RankingTableRow>[] = [];
    public loading = false;

    constructor(private http: HttpClient) {
        this.columns.push(new Column<RankingTableRow>({ name: "Ranking", field: "ranking", tooltip: "Extended Stats Ranking" }));
        this.columns.push(new Column<RankingTableRow>({
          name: "Game", field: "game_name", tooltip: "Game Name",
          valueHtml: r => `<a class="rankings-link" href="https://www.boardgamegeek.com/boardgame/${r.game}">${r.game_name}</a>`,
          valueTooltip: r => r.game_name
        }));
        this.columns.push(new Column<RankingTableRow>({ name: "Score", field: "total_ratings", tooltip: "Total Score" }));
        this.columns.push(new Column<RankingTableRow>({ name: "Ratings", field: "num_ratings", tooltip: "Number of Ratings" }));
        this.columns.push(new Column<RankingTableRow>({ name: "BGG Ranking", field: "bgg_ranking", tooltip: "BGG Ranking" }));
        this.columns.push(new Column<RankingTableRow>({ name: "BGG Rating", field: "bgg_rating", tooltip: "BGG Rating" }));
        this.columns.push(new Column<RankingTableRow>({ name: "Normalised Score", field: "normalised_ranking", tooltip: "Normalised Score" }));
        this.columns.push(new Column<RankingTableRow>({ name: "Total Plays", field: "total_plays", tooltip: "Total Plays" }));
        this.columns.push(new Column<RankingTableRow>({ name: "H-index", field: "hindex", tooltip: "H-Index" }));
        this.columns.push(new Column<RankingTableRow>({ name: "G-index", field: "gindex", tooltip: "G-Index" }));
    }

    public ngAfterViewInit(): void {
        const loadData$: Observable<any> = this.http.get(`/api/rankings`);
        this.loading = true;
        this.subscription = loadData$.subscribe({
            next: (result: RankingTableRow[]) => {
                this.rows = result;
                this.loading = false;
                console.log(this.rows);
            }
        });
    }

    public ngOnDestroy() {
        if (this.subscription) this.subscription.unsubscribe();
    }
}
