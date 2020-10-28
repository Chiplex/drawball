import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from "@angular/core";
import { fabric } from "fabric";
import { Props } from './interfaces/props';
import { map } from 'rxjs/operators';
import { CountriesService } from './services/countries.service';


@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent implements OnInit {
  public canvas: any;
  public isRedoing: boolean;
  public canvasHistory: any[];

  public figureEditor: boolean = false;
  public textEditor: boolean = false;
  private imageEditor: boolean = false;
  public pathEditor: boolean = false;

  public textString: string;
  public textSelected:any;
  public size: any = {
    width: 1100,
    height: 500
  };
  public resultImage: any;
  public selected: any;
  public properties:Props = {
    id:null,
    opacity:null,
    brush:{
      color:null,
      width:null,
      mode:'Pencil',
      shadowColor: "#ffffff",
      shadowWidth: 20,
      shadowOffsetX: 10,
      shadowOffsetY: 10
    },
    canvas:{
      fill:'#ffffff',
      image:''
    },
    fill:null,
    text:{
      align:null,
      charSpacing:null,
      decoration:null,
      fontFamily:null,
      fontSize:null,
      fontStyle:null,
      fontWeight:null,
      lineHeight:null
    }
  };
  public url: any = '';


  get drawingMode(): boolean {
    return this.canvas.isDrawingMode;
  }
  set drawingMode(val: boolean) {
    this.canvas.isDrawingMode = val;
    this.getBrushColor();
    this.getBrushWidth();
    this.getBrushShadowColor();
    this.getBrushShadowOffsetX();
    this.getBrushShadowOffsetY();
  }
  
   constructor(private http: HttpClient, private countriesService: CountriesService) {
    this.isRedoing = false;
    this.canvasHistory = [];
    this.resultImage = null;
    if (screen.width > 361) {
      this.size.width = 1100;
    } else {
      this.size.width = 330;
    }
  }

  ngOnInit() {
    this.countriesService.getCountries().subscribe(res => this.countries = res);
    this.canvas = new fabric.Canvas("canvas", {
      selection: true,
      stateful: true
    }).setWidth(this.size.width).setHeight(this.size.height);

    this.canvas.freeDrawingBrush = new fabric[this.properties.brush.mode + "Brush"](this.canvas);
    this.canvas.freeDrawingBrush.color = "#ff0000";
    this.canvas.freeDrawingBrush.width = 5;
    this.canvas.hoverCursor = "move";
    
    this.canvas.freeDrawingBrush.shadow = new fabric.Shadow({
      blur: parseInt(this.properties.brush.shadowWidth.value, 10) || 0,
      offsetX: this.properties.brush.shadowOffsetX,
      offsetY: this.properties.brush.shadowOffsetY,
      affectStroke: true,
      color: this.properties.brush.shadowColor
    });
    this.canvas.freeDrawingBrush.shadowBlur = 0;
    this.canvas.freeDrawingBrush.shadow.color = "#000350"

    this.canvas.on({
      'object:moving': (e) => { },
      'object:modified': (e) => { },
      'object:added': (e) => {
        const object = e.target;
        if (!this.isRedoing) {
          this.canvasHistory = [];
        }
        this.isRedoing = false;
      },
      'object:selected': (e) => {

        let selectedObject = e.target;
        this.selected = selectedObject;
        selectedObject.hasRotatingPoint = true;
        selectedObject.transparentCorners = false;

        if (selectedObject.type !== 'group' && selectedObject) {
          this.textSelected = "Items selected";

          this.getId();
          this.getOpacity();

          switch (selectedObject.type) {
            case 'rect':
            case 'circle':
            case 'triangle':
              this.figureEditor = true;
              this.getFill();
              break;
            case 'i-text':
              this.textEditor = true;
              this.getLineHeight();
              this.getCharSpacing();
              this.getBold();
              this.getFontStyle();
              this.getFill();
              this.getTextDecoration();
              this.getTextAlign();
              this.getFontFamily();
              break;
            case 'image':
              this.imageEditor = true;
              break;
            case 'path':
              this.pathEditor = true;
              this.getBrushColor();
              this.getBrushWidth();
              this.getBrushShadowColor();
              break;
          }
        }

        if(selectedObject.type == 'group'){
          this.textSelected = "Group Selected";
        }
      },
      'selection:cleared': (e) => {
        this.textSelected = "No items selected";
        this.selected = null;
        this.resetPanels();
      },
      'path': (e) => { 
        this.textSelected = "Mode Drawing";
      },
    });
  }

  // Menu NavBar: Archivo
  rasterize() {
    this.resultImage = this.canvas.toDataURL(
      { format: 'png' }
    );
  }

  rasterizeSVG(){
    var w = window.open("");
    w.document.write(this.canvas.toSVG())
  }

  saveCanvasToJSON() {
    let json = JSON.stringify(this.canvas);
    localStorage.setItem('DrawBallCanvas', json);
  }

  loadCanvasFromJSON() {
    let CANVAS = localStorage.getItem('DrawBallCanvas');
    this.canvas.loadFromJSON(CANVAS, () => {
      this.canvas.renderAll();
    });

  };
  // END Menu NavBar: Archivo

  // Menu: Edicion
  confirmClear() {
    if (confirm('Are you sure?')) {
      this.canvas.clear();
    }
  }

  undo() {
    if (this.canvas._objects.length > 0) {
      const undoObject = this.canvas._objects.pop();
      this.canvasHistory.push(undoObject);
      this.canvas.renderAll();
    }
  }

  redo() {
    if (this.canvasHistory.length > 0) {
      this.isRedoing = true;
      const redoObject = this.canvasHistory.pop();
      this.canvas.add(redoObject);
    }
  }

  deleteObject() {
    const object = this.canvas.getActiveObject();
    this.canvas.remove(object);
  }

  bringForward(){
    let activeObject = this.canvas.getActiveObject();
    if (activeObject) 
      this.canvas.bringForward(activeObject);
      this.canvas.discardActiveObject();
      this.canvas.renderAll();
  }

  bringToFront() {
    let activeObject = this.canvas.getActiveObject();
    if (activeObject) 
      this.canvas.bringToFront(activeObject);
      this.canvas.discardActiveObject();
      this.canvas.renderAll();
  }

  sendBackwards() {
    let activeObject = this.canvas.getActiveObject();
    if (activeObject)
      this.canvas.sendBackwards(activeObject);
      this.canvas.discardActiveObject();
      this.canvas.renderAll();
  }

  sendToBack() {
    let activeObject = this.canvas.getActiveObject();
    if (activeObject)
      this.canvas.sendToBack(activeObject);
      this.canvas.discardActiveObject();
      this.canvas.renderAll();
      
  }

  clone() {
    let activeObject = this.canvas.getActiveObject();

    if (activeObject.toObject()) {
      let clone;
      switch (activeObject.type) {
        case 'rect':
          clone = new fabric.Rect(activeObject.toObject());
          break;
        case 'circle':
          clone = new fabric.Circle(activeObject.toObject());
          break;
        case 'triangle':
          clone = new fabric.Triangle(activeObject.toObject());
          break;
        case 'i-text':
          clone = new fabric.IText('', activeObject.toObject());
          break;
        case 'image':
          clone = fabric.util.object.clone(activeObject);
          break;
        case 'path':
          clone = fabric.util.object.clone(activeObject);
          break;
        case 'group':
          clone = new fabric.Group();
          for (const i in activeObject._objects) {
            activeObject._objects[i].clone(function (cloneObj) {
              clone.addWithUpdate(cloneObj);
            });
          }
          break;
      }
      if (clone) {
        clone.set({ left: (activeObject.top ?? activeObject._objects[0].top) + 5, top: (activeObject.left ?? activeObject._objects[0].left) + 5 });
        this.canvas.add(clone);
        this.selectItemAfterAdded(clone);
      }
    }
  }

  selectAll(){
    this.canvas.discardActiveObject();
    var sel = new fabric.ActiveSelection(this.canvas.getObjects(),{
      canvas:this.canvas
    })
    this.canvas.setActiveObject(sel);
    this.canvas.requestRenderAll()
  }

  group(){
    if (!this.canvas.getActiveObject()) {
      return;
    }
    if (this.canvas.getActiveObject().type !== 'activeSelection') {
      return;
    }
    this.canvas.getActiveObject().toGroup();
    this.canvas.requestRenderAll();
  }

  ungroup(){
    if (!this.canvas.getActiveObject()) {
      return;
    }
    if (this.canvas.getActiveObject().type !== 'group') {
      return;
    }
    this.canvas.getActiveObject().toActiveSelection();
    this.canvas.requestRenderAll();
  }

  lock(){
    console.log(this.canvas.getActiveObject());
  
    this.canvas.getActiveObject().selectable = false;
  }

  unlock(){
    this.canvas.getActiveObject().selectable = true;
  }
  // END Menu: Edicion

  // Menu: Canvas
  changeSize(event: any) {
    this.canvas.setWidth(this.size.width);
    this.canvas.setHeight(this.size.height);
  }

  setCanvasFill() {
    if (this.properties.canvas.fill) {
      this.canvas.backgroundColor = this.properties.canvas.fill;
      this.canvas.renderAll();
    }
  }
  // END Menu: Canvas

  // Tools: Drawing
  getBrushColor(){
    this.properties.brush.color = this.canvas.freeDrawingBrush.color;
  }

  setBrushColor(){
    this.canvas.freeDrawingBrush.color = this.properties.brush.color;
  }

  getBrushWidth(){
    this.properties.brush.width = this.canvas.freeDrawingBrush.width;
  }

  setBrushWidth(){
    this.canvas.freeDrawingBrush.width = this.properties.brush.width;
  }

  setBrushMode(){
    this.canvas.freeDrawingBrush = new fabric[this.properties.brush.mode + "Brush"](this.canvas);
    this.setBrushColor();
    this.setBrushWidth();
    this.setBrushShadow();
  }

  setBrushShadow(){
    this.canvas.freeDrawingBrush.shadow = new fabric.Shadow({
      blur: parseInt(this.properties.brush.shadowWidth.value, 10) || 0,
      offsetX: this.properties.brush.shadowOffsetX,
      offsetY: this.properties.brush.shadowOffsetY,
      affectStroke: true,
      color: this.properties.brush.shadowColor
    });
  }

  getBrushShadowColor(){
    this.properties.brush.shadowColor = this.canvas.freeDrawingBrush.shadow.color;
  }

  setBrushShadowColor(){
    this.canvas.freeDrawingBrush.shadow.color = this.properties.brush.shadowColor;
  }

  getBrushShadowWidth(){
    this.properties.brush.shadowWidth = this.canvas.freeDrawingBrush.shadow.blur;
  }

  setBrushShadowWidth(){
    this.canvas.freeDrawingBrush.shadow.blur = this.properties.brush.shadowWidth;
  }

  getBrushShadowOffsetX(){
    this.properties.brush.shadowOffsetX = this.canvas.freeDrawingBrush.shadow.offsetX;
  }

  setBrushShadowOffsetX(){
    this.canvas.freeDrawingBrush.shadow.offsetX = this.properties.brush.shadowOffsetX;
  }

  getBrushShadowOffsetY(){
    this.properties.brush.shadowOffsetY = this.canvas.freeDrawingBrush.shadow.offsetY;
  }

  setBrushShadowOffsetY(){
    this.canvas.freeDrawingBrush.shadow.offsetY = this.properties.brush.shadowOffsetY;
  }
  // END Tools: Drawing

  // Tools: Text
  addText() {
    this.drawingMode = false;
    let textString = this.textString;
    let text = new fabric.IText(textString, {
      left: 10,
      top: 10,
      fontFamily: 'helvetica',
      angle: 0,
      fill: '#000000',
      scaleX: 0.5,
      scaleY: 0.5,
      fontWeight: '',
      hasRotatingPoint: true
    });
    this.extend(text, this.randomId());
    this.canvas.add(text);
    this.selectItemAfterAdded(text);
    this.textString = '';
  }
  // END Tools: Text

  // Tools: Image
  getImgPolaroid(event: any) {
    this.drawingMode = false;
    let el = event.target;
    fabric.Image.fromURL(el.src, (image) => {
      console.log(image);
    
      image.set({
        left: 10,
        top: 10,
        angle: 0,
        padding: 10,
        cornersize: 10,
        hasRotatingPoint: true,
        peloas: 12,
        clipTo: function (ctx) {
          // ctx.beginPath();
          // ctx.moveTo(0, 0);
          // ctx.quadraticCurveTo(0, 250, 250, 250);
          // ctx.moveTo(250, 250);
          // ctx.quadraticCurveTo(500, 250, 250, 250);
          //ctx.moveTo(250, 250);
          
          ctx.arc(0, 0, image.height/2, 0, Math.PI * 2, true);
        }
      });
      image.scaleToWidth(150);
      image.scaleToHeight(150);
      this.extend(image, this.randomId());
      this.canvas.add(image);
      this.selectItemAfterAdded(image);
    });
  }
  // END Tools: Image

  // Tools: Upload Image
  addImageOnCanvas(url) {
    if (url) {
      fabric.Image.fromURL(url, (image) => {
        image.set({
          left: 10,
          top: 10,
          angle: 0,
          padding: 10,
          cornersize: 10,
          hasRotatingPoint: true
        });
        image.scaleToWidth(200);
        image.scaleToHeight(200);
        this.extend(image, this.randomId());
        this.canvas.add(image);
        this.selectItemAfterAdded(image);
      });
    }
  }

  readUrl(event) {
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      reader.onload = (event) => {
        this.url = event.target['result'];
      }
      reader.readAsDataURL(event.target.files[0]);
    }
  }

  removeWhite(url) {
    this.url = '';
  };
  // END Tools: Upload Image

  // Tools: Figures
  addFigure(figure) {
    let add: any;
    switch (figure) {
      case 'rectangle':
        add = new fabric.Rect({
          width: 200, height: 100, left: 10, top: 10, angle: 0,
          fill: '#3f51b5'
        });
        break;
      case 'square':
        add = new fabric.Rect({
          width: 100, height: 100, left: 10, top: 10, angle: 0,
          fill: '#4caf50'
        });
        break;
      case 'triangle':
        add = new fabric.Triangle({
          width: 100, height: 100, left: 10, top: 10, fill: '#2196f3'
        });
        break;
      case 'circle':
        add = new fabric.Circle({
          radius: 50, left: 10, top: 10, fill: '#ff5722'
        });
        break;
    }
    this.extend(add, this.randomId());
    this.canvas.add(add);
    this.selectItemAfterAdded(add);
  }
  // END Tools: Figures

  // System: Properties
  getId() {
    this.properties.id = this.canvas.getActiveObject().toObject().id;
  }

  getOpacity() {
    this.properties.opacity = this.getActiveStyle('opacity', null) * 100;
  }

  setOpacity() {
    this.setActiveStyle('opacity', parseInt(this.properties.opacity) / 100, null);
  }

  getFill() {
    this.properties.fill = this.getActiveStyle('fill', null);
  }

  setFill() {
    this.setActiveStyle('fill', this.properties.fill, null);
  }

  getLineHeight() {
    this.properties.text.lineHeight = this.getActiveStyle('lineHeight', null);
  }

  setLineHeight() {
    this.setActiveStyle('lineHeight', parseFloat(this.properties.text.lineHeight), null);
  }

  getCharSpacing() {
    this.properties.text.charSpacing = this.getActiveStyle('charSpacing', null);
  }

  setCharSpacing() {
    this.setActiveStyle('charSpacing', this.properties.text.charSpacing, null);
  }

  getFontSize() {
    this.properties.text.fontSize = this.getActiveStyle('fontSize', null);
  }

  setFontSize() {
    this.setActiveStyle('fontSize', parseInt(this.properties.text.fontSize), null);
  }

  getBold() {
    this.properties.text.fontWeight = this.getActiveStyle('fontWeight', null);
  }

  setBold() {
    this.properties.text.fontWeight = !this.properties.text.fontWeight;
    this.setActiveStyle('fontWeight', this.properties.text.fontWeight ? 'bold' : '', null);
  }

  getFontStyle() {
    this.properties.text.fontStyle = this.getActiveStyle('fontStyle', null);
  }

  setFontStyle() {
    this.properties.text.fontStyle = !this.properties.text.fontStyle;
    this.setActiveStyle('fontStyle', this.properties.text.fontStyle ? 'italic' : '', null);
  }

  setFontFamily() {
    this.setActiveProp('fontFamily', this.properties.text.fontFamily);
  }

  getTextDecoration() {
    this.properties.text.decoration = this.getActiveStyle('textDecoration', null);
  }

  hasTextDecoration(value) {
    return this.properties.text.decoration.includes(value);
  }

  setTextDecoration(value) {
    let iclass = this.properties.text.decoration;
    if (iclass.includes(value)) {
      iclass = iclass.replace(RegExp(value, "g"), "");
    } else {
      iclass += ` ${value}`
    }
    this.properties.text.decoration = iclass;
    this.setActiveStyle('textDecoration', this.properties.text.decoration, null);
  }

  getTextAlign() {
    this.properties.text.align = this.getActiveProp('textAlign');
  }

  setTextAlign(value) {
    this.properties.text.align = value;
    this.setActiveProp('textAlign', this.properties.text.align);
  }

  getFontFamily() {
    this.properties.text.fontFamily = this.getActiveProp('fontFamily');
  }
  // END System: Properties

  // Sistema Active Properties
  getActiveStyle(styleName, object) {
    object = object || this.canvas.getActiveObject();
    if (!object) return '';

    return (object.getSelectionStyles && object.isEditing)
      ? (object.getSelectionStyles()[styleName] || '')
      : (object[styleName] || '');
  }

  setActiveStyle(styleName, value, object) {
    object = object || this.canvas.getActiveObject();
    if (!object) return;

    if (object.setSelectionStyles && object.isEditing) {
      var style = {};
      style[styleName] = value;
      object.setSelectionStyles(style);
      object.setCoords();
    }
    else {
      object.set(styleName, value);
    }

    object.setCoords();
    this.canvas.renderAll();
  }

  getActiveProp(name) {
    var object = this.canvas.getActiveObject();
    if (!object) return '';

    return object[name] || '';
  }

  setActiveProp(name, value) {
    var object = this.canvas.getActiveObject();
    if (!object) return;
    object.set(name, value).setCoords();
    this.canvas.renderAll();
  }

  resetPanels() {
    this.pathEditor = false;
    this.textEditor = false;
    this.imageEditor = false;
    this.figureEditor = false;
  }
  // END Sistema Active Properties

  // Active Tools
  extend(obj, id) {
    obj.toObject = (function (toObject) {
      return function () {
        return fabric.util.object.extend(toObject.call(this), {
          id: id
        });
      };
    })(obj.toObject);
  }

  randomId() {
    return Math.floor(Math.random() * 999999) + 1;
  }

  selectItemAfterAdded(obj) {
    this.canvas.discardActiveObject();
    this.canvas.setActiveObject(obj);
  }
  // END Active Tools

  // Various
}
