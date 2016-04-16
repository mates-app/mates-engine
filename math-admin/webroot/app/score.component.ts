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
} from 'angular2/core';
import {Editable} from './td-editable.component';
import {ExtraScoreComponent} from './extra-score.component';
import {LevelConfig} from './level-config';


@Component({
    selector: 'score',
    templateUrl: 'app/score.component.html',
    directives: [
        Editable, 
        ExtraScoreComponent]
})
export class ScoreComponent{
    @Input() levelConfigs:Array<LevelConfig>;
}