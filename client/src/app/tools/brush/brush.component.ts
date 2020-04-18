import { Component, OnInit, Host } from '@angular/core';
import { AppComponent } from 'src/app/app.component';
import { Brush } from 'src/app/interfaces/brush';
import { fabric } from "fabric";

@Component({
  selector: 'app-brush',
  templateUrl: './brush.component.html',
  styleUrls: ['./brush.component.css']
})
export class BrushComponent implements OnInit {
  public brush:Brush = {
      color: "#ff0000",
      width: 5,
      mode: 'Pencil',
      shadowColor: "#ffffff",
      shadowWidth: 20,
      shadowOffsetX: 10,
      shadowOffsetY: 10
    };
  constructor(@Host() private app:AppComponent) { }

  ngOnInit(): void {
  }

  getBrushColor(){
    this.brush.color = this.app.canvas.freeDrawingBrush.color;
  }

  setBrushColor(){
    this.app.canvas.freeDrawingBrush.color = this.brush.color;
  }

  getBrushWidth(){
    this.brush.width = this.app.canvas.freeDrawingBrush.width;
  }

  setBrushWidth(){
    this.app.canvas.freeDrawingBrush.width = this.brush.width;
  }

  setBrushMode(){
    this.app.canvas.freeDrawingBrush = new fabric[this.brush.mode + "Brush"](this.app.canvas);
    this.setBrushColor();
    this.setBrushWidth();
    this.setBrushShadow();
  }

  setBrushShadow(){
    this.app.canvas.freeDrawingBrush.shadow = new fabric.Shadow({
      blur: parseInt(this.brush.shadowWidth.value, 10) || 0,
      offsetX: this.brush.shadowOffsetX,
      offsetY: this.brush.shadowOffsetY,
      affectStroke: true,
      color: this.brush.shadowColor
    });
  }

  getBrushShadowColor(){
    this.brush.shadowColor = this.app.canvas.freeDrawingBrush.shadow.color;
  }

  setBrushShadowColor(){
    this.app.canvas.freeDrawingBrush.shadow.color = this.brush.shadowColor;
  }

  getBrushShadowWidth(){
    this.brush.shadowWidth = this.app.canvas.freeDrawingBrush.shadow.blur;
  }

  setBrushShadowWidth(){
    this.app.canvas.freeDrawingBrush.shadow.blur = this.brush.shadowWidth;
  }

  getBrushShadowOffsetX(){
    this.brush.shadowOffsetX = this.app.canvas.freeDrawingBrush.shadow.offsetX;
  }

  setBrushShadowOffsetX(){
    this.app.canvas.freeDrawingBrush.shadow.offsetX = this.brush.shadowOffsetX;
  }

  getBrushShadowOffsetY(){
    this.brush.shadowOffsetY = this.app.canvas.freeDrawingBrush.shadow.offsetY;
  }

  setBrushShadowOffsetY(){
    this.app.canvas.freeDrawingBrush.shadow.offsetY = this.brush.shadowOffsetY;
  }

}
