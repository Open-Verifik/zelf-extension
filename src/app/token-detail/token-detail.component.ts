import { CurrencyPipe, DecimalPipe, NgClass, NgFor, NgIf } from "@angular/common";
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnDestroy, Renderer2, ViewChild } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { Router, RouterLink } from "@angular/router";
import { TranslocoModule } from "@jsverse/transloco";
import { AssetService, NetworkPermissions } from "app/asset.service";
import { AssetChart, AssetDetails, AssetIntervalOptions, AssetRange } from "app/models/asset.model";
import { SafeHtmlPipe } from "app/pipes/safe-html.pipe";
import { TruncateNumberPipe } from "app/pipes/truncate-number.pipe";
import { NetworkName, NetworkService } from "app/services/network.service";
import { TransactionService } from "app/transaction.service";
import { TokenData, TransactionData } from "app/wallet";
import { WalletService } from "app/wallet.service";
import { ZelfHistoryComponent } from "app/zelf-history/zelf-history.component";
import { ZelfLoaderComponent } from "app/zelf-loader/zelf-loader.component";
import { AreaData, AreaSeries, AreaSeriesOptions, ChartOptionsBase, ColorType, createChart, IChartApi, ISeriesApi } from "lightweight-charts";
import { Subject, takeUntil } from "rxjs";

@Component({
    imports: [
        CurrencyPipe,
        DecimalPipe,
        MatButtonModule,
        NgClass,
        NgFor,
        NgIf,
        RouterLink,
        SafeHtmlPipe,
        TranslocoModule,
        TruncateNumberPipe,
        ZelfHistoryComponent,
        ZelfLoaderComponent,
    ],
    selector: "token-detail",
    styleUrls: ["./token-detail.component.scss"],
    templateUrl: "./token-detail.component.html",
})
export class TokenDetailComponent implements AfterViewInit, OnDestroy {
    @ViewChild("chartContainer", { static: false }) chartContainer!: ElementRef<HTMLDivElement>;

    private areaSeries!: ISeriesApi<"Area">;
    private CAN_SEND: NetworkPermissions = {};
    private CAN_SWAP: NetworkPermissions = {};
    private chart!: IChartApi;
    private unsubscriber$: Subject<void> = new Subject<void>();
    private windowResizeListener: () => void = () => {};

    asset: Partial<TokenData> = {};
    chartData: AssetChart[] | null = null;
    details: AssetDetails = new AssetDetails({} as AssetDetails);
    intervals: AssetIntervalOptions = [];
    loading: boolean = true;
    loadingChart: boolean = true;
    loadingDetails: boolean = true;
    readMore: boolean = false;
    selectedRange: AssetRange = "1d";
    selectedTab: string = "about";

    constructor(
        private _assetService: AssetService,
        private _changeDetectorRef: ChangeDetectorRef,
        private _networkService: NetworkService,
        private _renderer: Renderer2,
        private _router: Router,
        private _transactionService: TransactionService,
        private _walletService: WalletService
    ) {
        this.CAN_SEND = this._assetService.canSend;
        this.CAN_SWAP = this._assetService.canSwap;
        this.intervals = this._assetService.intervals;
    }

    ngAfterViewInit(): void {
        this.asset = this._assetService.sourceAsset;
        this.loading = !Object.keys(this.asset).length;

        if (!this.loading) setTimeout(() => this._setChart(), 100);

        this._assetService.sourceAsset$.pipe(takeUntil(this.unsubscriber$)).subscribe((asset) => {
            this.asset = asset;

            if (!this.loading) return;

            this.loading = false;

            setTimeout(() => this._setChart(), 100);
        });

        this.windowResizeListener = this._renderer.listen("window", "resize", () => {
            this._resizeChart();
        });
    }

    ngOnDestroy(): void {
        if (this.chart) this.chart.remove();

        this.windowResizeListener();
        this.unsubscriber$.next();
        this.unsubscriber$.complete();
    }

    get circulatingSupplyInFiat(): string {
        const circulatingSupply = this.details.about.information.circulatingSupply;
        const price = this.details.price.price;

        const circulatingSupplyInFiat = circulatingSupply * price;

        return `$ ${new TruncateNumberPipe().transform(circulatingSupplyInFiat)}`;
    }

    get networkSymbol(): string {
        return this._networkService.getNetworkSymbol(this.asset.network?.toLowerCase() as NetworkName);
    }

    get priceChangePercentage(): number {
        if (!this.chartData || this.chartData.length < 2) {
            return this.details.price.priceChangePercentage24h || 0;
        }

        const firstValue = this.chartData[0].open;
        const lastValue = this.chartData[this.chartData.length - 1].close;

        return ((lastValue - firstValue) / firstValue) * 100;
    }

    get priceChangeToken(): number {
        if (!this.chartData || this.chartData.length < 2) {
            return this.details.about.information.volumeChangePercentage24h || 0;
        }

        const firstValue = this.chartData[0].open;
        const lastValue = this.chartData[this.chartData.length - 1].close;

        return lastValue - firstValue;
    }

    private async _fetchAssetChart(): Promise<any> {
        if (!this.asset.symbol) return;

        try {
            const response = await this._assetService.fetchAssetChart(this.asset.symbol, this.selectedRange);

            this.chartData = response.data?.length > 0 ? response.data : null;

            this._changeDetectorRef.markForCheck();
        } catch (error) {
            console.error(` TokenDetailComponent ~ this._assetService.fetchAssetChart ~ error:`, error);

            this.chartData = null;
        } finally {
            this.loadingChart = false;
        }
    }

    private async _fetchAssetDetails(): Promise<any> {
        if (!this.asset.symbol) return;

        try {
            const response = await this._assetService.fetchAssetDetails(this.asset.symbol, "1h", 10);

            this.details = new AssetDetails(response.data);
            this.details.about.description = this.cleanMarkdown(this.details.about.description);

            this._changeDetectorRef.markForCheck();
        } catch (error) {
            console.error(` TokenDetailComponent ~ this._assetService.fetchAssetDetails ~ error:`, error);
        } finally {
            this.loadingDetails = false;
        }
    }

    async _requestData(): Promise<void> {
        await Promise.all([this._fetchAssetDetails(), this._fetchAssetChart()]);

        this._setChartData();
    }

    async _requestChartData(): Promise<void> {
        await this._fetchAssetChart();

        this._setChartData();
    }

    private _resizeChart() {
        if (!this.chart) return;

        const isSmallerScreen = window.innerWidth <= 468;
        const chartHeight = isSmallerScreen ? 100 : 50;

        this.chart.resize(0, chartHeight);

        const chartWidth = isSmallerScreen ? this.chartContainer.nativeElement.clientWidth * 0.8 : this.chartContainer.nativeElement.clientWidth;

        this.chart.resize(chartWidth, chartHeight);
    }

    private _setChart(): void {
        if (!this.chartContainer) return;

        const isSmallerScreen = window.innerWidth <= 468;
        const chartContainer = this.chartContainer.nativeElement;

        const chartOptions = {
            handleScale: false,
            handleScroll: false,
            height: 50,
            width: chartContainer.clientWidth,
            crosshair: { mode: 2, horzLine: { visible: false } },
            grid: {
                horzLines: { visible: false },
                vertLines: { visible: false },
            },
            kineticScroll: { touch: false, mouse: false },
            layout: {
                background: {
                    color: "transparent",
                    type: ColorType.Solid,
                },
            },
            rightPriceScale: {
                borderVisible: false,
                visible: false,
            },
            timeScale: {
                visible: false,
            },
            overlayPriceScales: { ticksVisible: false },
        } as ChartOptionsBase;

        chartOptions.height = isSmallerScreen ? 100 : 50;
        chartOptions.width = isSmallerScreen ? this.chartContainer.nativeElement.clientWidth * 0.6 : this.chartContainer.nativeElement.clientWidth;

        this.chart = createChart(chartContainer, chartOptions);

        this._requestData();
    }

    private _setChartData() {
        if (!this.chartData?.length) return;
        if (this.areaSeries) this.chart.removeSeries(this.areaSeries);

        const postiveTrend = this.priceChangePercentage > 0;

        const areaSeriesOptions = {
            bottomColor: postiveTrend ? "rgba(30, 164, 70, 0)" : "rgba(220, 54, 46, 0)",
            crosshairMarkerVisible: false,
            lineColor: postiveTrend ? "#1ea446" : "#dc362e",
            lineWidth: 1,
            priceLineVisible: false,
            topColor: postiveTrend ? "rgba(30, 164, 70, 0.3)" : "rgba(220, 54, 46, 0.3)",
        } as AreaSeriesOptions;

        this.areaSeries = this.chart.addSeries(AreaSeries, areaSeriesOptions);

        this.areaSeries.setData(this.chartData.map((item) => ({ time: item.time, value: item.close })) as AreaData[]);

        this._resizeChart();
    }

    async changeRange(range: AssetRange): Promise<void> {
        if (!this.chartData?.length) return;

        this.selectedRange = range;

        await this._requestChartData();
    }

    checkCanSend(): boolean {
        return this.CAN_SEND[this.networkSymbol as keyof NetworkPermissions] || false;
    }

    checkCanSwap(): boolean {
        return this.CAN_SWAP[this.networkSymbol as keyof NetworkPermissions] || false;
    }

    cleanMarkdown(input: string): string {
        return input
            .replace(/^#+\s.*$/gm, "")
            .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
            .replace(/\*\*(.*?)\*\*/g, "$1")
            .replace(/\*(.*?)\*/g, "$1")
            .replace(/\n{2,}/g, "\n")
            .replace(/\n/g, "\n\n")
            .trim();
    }

    async prepareSend(): Promise<void> {
        const address = await this._walletService.getWalletAddressByTokenType(this.asset.tokenType as string);

        if (!address) throw new Error("No address found");

        const zelfName = (await this._walletService.getCurrentWallet())?.publicData?.zelfName;

        await this._transactionService.setCurrentTransactionData(
            new TransactionData({
                sender: { address, zelfName },
                token: this.asset,
            })
        );

        this._router.navigate(["/send", "transaction"]);
    }

    removeAsset() {
        this._assetService.removeSourceAsset();
    }

    selectTab(tab: string) {
        this.selectedTab = tab;

        this._changeDetectorRef.detectChanges();
    }
}
