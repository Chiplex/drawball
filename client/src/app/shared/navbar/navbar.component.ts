import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { fabric } from "fabric";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  @Input('dataCanvas') canvas:any;
  @Input('dataHistory') canvasHistory:any;
  @Input('dataIsRedoing') isRedoing:any;
  @Output() canvasChange = new EventEmitter<any>();
  constructor() { }

  ngOnInit(): void {
  }

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

  // clone() {
  //   let activeObject = this.canvas.getActiveObject();

  //   if (activeObject.toObject()) {
  //     let clone;
  //     switch (activeObject.type) {
  //       case 'rect':
  //         clone = new fabric.Rect(activeObject.toObject());
  //         break;
  //       case 'circle':
  //         clone = new fabric.Circle(activeObject.toObject());
  //         break;
  //       case 'triangle':
  //         clone = new fabric.Triangle(activeObject.toObject());
  //         break;
  //       case 'i-text':
  //         clone = new fabric.IText('', activeObject.toObject());
  //         break;
  //       case 'image':
  //         clone = fabric.util.object.clone(activeObject);
  //         break;
  //       case 'path':
  //         clone = fabric.util.object.clone(activeObject);
  //         break;
  //       case 'group':
  //         clone = new fabric.Group();
  //         for (const i in activeObject._objects) {
  //           activeObject._objects[i].clone(function (cloneObj) {
  //             clone.addWithUpdate(cloneObj);
  //           });
  //         }
  //         break;
  //     }
  //     if (clone) {
  //       clone.set({ left: (activeObject.top ?? activeObject._objects[0].top) + 5, top: (activeObject.left ?? activeObject._objects[0].left) + 5 });
  //       this.canvas.add(clone);
  //       this.selectItemAfterAdded(clone);
  //     }
  //   }
  // }

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
}
