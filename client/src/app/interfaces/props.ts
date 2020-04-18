import { Brush } from "./brush";
import { Text } from "./text";
import { Canvas } from './canvas';

export interface Props {
    id: any;
    fill: any;
    opacity:any;
    canvas:Canvas;
    brush: Brush;
    text: Text;
}
