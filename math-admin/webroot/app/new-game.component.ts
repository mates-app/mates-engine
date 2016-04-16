import {Component, Input, Output} from 'angular2/core';
import {Router, RouteParams, ROUTER_DIRECTIVES} from 'angular2/router';
import {
    LevelConfig, 
    EquationProblemConfig, 
    ProblemType, 
    Stage,
    SimpleProblemConfig
} from './level-config';
import {Editable} from './td-editable.component';
import {GameConfig} from './game-config';
import {ExtraScoreComponent} from './extra-score.component';
import {AdminService} from './admin.service';
import {HTTP_PROVIDERS}    from 'angular2/http';
import {MathFormComponent} from './math-form-combo.component';
import {SelectOperationComponent} from './select-operations.component';
import {ScoreComponent} from './score.component';
import {ArithLevelComponent} from './arith-level.component';
import {EquationLevelComponent} from './equation-level.component';

@Component({
    selector: 'new-game',
    templateUrl: 'app/new-game.component.html',
    directives: [
        ROUTER_DIRECTIVES, 
        Editable, 
        ExtraScoreComponent, 
        MathFormComponent, 
        SelectOperationComponent,
        ScoreComponent,
        ArithLevelComponent,
        EquationLevelComponent],
    providers: [
        HTTP_PROVIDERS, 
        AdminService]

})
export class NewGameComponent {
    constructor(
        private adminService: AdminService,
        private _routeParams: RouteParams
        ) { }

    gameConfig: GameConfig;
    showProblemConfig = 'block';
    showScoreConfig = 'none';
    showHideTables = "Mostrar Configuración de Puntuación";
    showinTable = "scoreConfig";
    state:string = 'none';

    stageOptions:Array<String> = [
        "SIMPLE", "EQUATION"
    ]

    ngOnInit() {
        console.log("init NewGameComponent");
        this.gameConfig = JSON.parse(this._routeParams.get('gameConfig'));

        if(!this.gameConfig){
            this.gameConfig = new GameConfig();
            this.gameConfig.stages.push(new Stage());
            this.gameConfig.stages.push(new Stage());
            this.gameConfig.stages[0].levelConfigs[0].problemConfig = new EquationProblemConfig();
            this.gameConfig.stages[1].levelConfigs[0].problemConfig = new EquationProblemConfig();
        }       
    }

    changeShowTable() {
        if (this.showProblemConfig == 'block') {
            this.showHideTables = "Mostrar Configuración de Problema";
            this.showProblemConfig = 'none';
            this.showScoreConfig = 'block';
        } else {
            this.showHideTables = "Mostrar Configuración de Puntuación";
            this.showScoreConfig = 'none';
            this.showProblemConfig = 'block';
        }
    }

    createStage(problemType:String){
        switch (problemType) {
            case "SIMPLE":
                this.gameConfig.stages.push(
                    new Stage(
                        [new LevelConfig(
                            new SimpleProblemConfig()
                            )
                        ])
                    )
                break;
            case "EQUATION":
            this.gameConfig.stages.push(
                    new Stage(
                        [new LevelConfig(
                            new EquationProblemConfig()
                            )
                        ])
                    )
                break;
            default:
                // code...
                break;
        }
        this.state = 'none';
    }

    setStatus(state:string){
        this.state = state;
        console.log('change '+state);
    }


    isSimple(levelConfig:LevelConfig){
        return levelConfig.problemConfig.getType() == ProblemType.SIMPLE;
    }

    printProblem() {
        return JSON.stringify(this.gameConfig);
    }

    printGame() {
        console.log(this.gameConfig);
    }

    toNumber(value) {
        return Number(value);
    }

    getSaveMessage(){
       return this.gameConfig._id ? "Actualizar" : "¡Crear Juego!";        
    }

    saveOrUpdateGame() {
        if(!this.gameConfig){
            this.adminService.saveGame(this.gameConfig).subscribe(
                res => console.log(res),
                error => console.log(error));
        }else{
            this.adminService.updateGameConfig(this.gameConfig).subscribe(
                res => console.log(res),
                error => console.log(error));
        }
        
    }

}
