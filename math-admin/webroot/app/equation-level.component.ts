import {
    Component,
    ElementRef,
    Input,
    Output,
    EventEmitter,
    ApplicationRef,
    NgSwitch,
    NgSwitchWhen,
    NgSwitchDefault
} from '@angular/core';
import {Editable} from './td-editable.component';
import {LevelConfig, EquationProblemConfig, ProblemType} from './level-config';
import {MathFormComponent} from './math-form-combo.component';
import {SelectOperationComponent} from './select-operations.component';
import {VariableComponent} from './editor/common/variable.component';
import {SampleProblemComponent} from './editor/common/sample-problem.component';

@Component({
    selector: 'equation-level',
    templateUrl: 'app/equation-level.component.html' ,
    directives: [
        Editable,
        MathFormComponent,
        SelectOperationComponent,
        VariableComponent,
        SampleProblemComponent
      ]
})
export class EquationLevelComponent{
    @Input() levelConfigs:Array<LevelConfig>;
    showProblem:boolean = false;

    printProblem() {
        return JSON.stringify(this.levelConfigs);
    }

    toNumber(value) {
        return Number(value);
    }

    addLevel() {
        this.levelConfigs.push(new LevelConfig(new EquationProblemConfig()));
    }

    toggleShowProblem(){
        this.showProblem = !this.showProblem;
    }

    getProblemType(){
      return ProblemType.EQUATION;
    }

}
