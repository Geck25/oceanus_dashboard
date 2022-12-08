import { Component, Input, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'compass-widget',
  templateUrl: './compass-widget.component.html',
  styleUrls: ['./compass-widget.component.css'],
  host: {
    class: 'full-height'
  }
})
export class CompassWidgetComponent implements OnInit {
  @ViewChild('canvas') canvas: any;
  @Input() measureName: string = '';
  @Input() measureValue: number = 0;
  @Input() type: string = '';
  context: CanvasRenderingContext2D | null = null;
  drawFunction: any;
  currentValue: number = 0;
  angles: (number | string)[] = [0, 45, 90, 135, 180, 225, 270, 315];

  constructor() { }

  ngOnInit(): void {
    this.currentValue = this.measureValue;
    this.drawFunction = this.type === 'regular' ? this.drawRegular : this.drawAlternative;
    this.setCanvasDimension();
  }

  ngAfterViewInit() {
    this.context = this.canvas!.nativeElement.getContext('2d');
    this.setCanvasDimension();
    this.drawFunction(this.currentValue);
  }


  //---------------------------------------------------------------------
  // FUNZIONE PER DISEGNARE LA BUSSOLA "CLASSICA" (regular)             |
  //---------------------------------------------------------------------

  /**
   * Regular compass serve per renderizzare una bussola "classica"
   * ovvero una bussola che presenta i valori degli angoli da 0-359
   * @param currentValue il valore attuale, in gradi
   */
   drawRegular(currentValue: number): void {
    this.context!.clearRect(0, 0, this.canvas!.nativeElement.width, this.canvas!.nativeElement.height);
    let centerX: number = this.canvas!.nativeElement.width / 2;
    let centerY: number = this.canvas!.nativeElement.height / 2;
    let canvasHeight: number = this.canvas!.nativeElement.height;

    this.context!.save();
    this.context!.translate(centerX, centerY);
    
    // disegno il cerchio
    this.drawCircle(0, 0, canvasHeight * 0.37, 0, 2 * Math.PI);
    // disegno le "tacche" e renderizzo i valori degli angoli
    this.angles.forEach(angle => {
      this.context!.save();
      this.context!.rotate(this.degreeToRadians(angle as number));
      this.context!.translate(0, -(canvasHeight * 0.37));
      this.context!.beginPath();
      this.context!.moveTo(0, 0);
      this.context!.lineTo(0, -10);
      this.context!.closePath();
      this.context!.stroke();
      this.context!.translate(-5, -20);
      this.context!.font = "16px sans-serif";
      if (angle === 0) {angle = 'N'; this.context!.fillStyle = "red"; }
      if (angle === 90) angle = 'E';
      if (angle === 180) angle = 'S';
      if (angle === 270) angle = 'O';
      this.context!.fillText(angle.toString(), 0, 0);
      this.context!.restore();
    });
    // draw current angle indicator
    this.context!.rotate(this.degreeToRadians(currentValue));
    this.context!.moveTo(0 - 20, 0-100);
    this.context!.lineTo(0 + 20, 0-100);
    this.context!.lineTo(0, 0 - 160);
    this.context!.fillStyle = "red";
    this.context!.fill();

    this.context!.restore();
  }


  //---------------------------------------------------------------------
  // FUNZIONE PER DISEGNARE LA BUSSOLA ALTERNATIVA                      |
  //---------------------------------------------------------------------

  drawAlternative(currentAngle: number): void {
    this.context!.clearRect(0, 0, this.canvas!.nativeElement.width, this.canvas!.nativeElement.height);
    let centerX: number = this.canvas!.nativeElement.width / 2;
    let centerY: number = this.canvas!.nativeElement.height / 2;
    let canvasHeight: number = this.canvas!.nativeElement.height;
    this.drawCircle(centerX, centerY, canvasHeight * 0.37, 0, 2 * Math.PI);
    
    this.drawAnglesIndicators(-1, '0', 5); // 0
    this.drawAnglesIndicators(1, '180'); // 180
    this.drawAnglesIndicators(1, '90', undefined, 'horizontal'); // 90
    this.drawAnglesIndicators(-1, '-90', undefined, 'horizontal'); // -90
    
    this.drawSegments(canvasHeight * 0.37, currentAngle);
    this.drawBoat(centerX, centerY, true);
  }


  //---------------------------------------------------------------------
  // FUNZIONI AUSILIARIE                                                |
  //---------------------------------------------------------------------

  

  private drawCircle(x: number, y: number, radius: number, startAngle: number, endAngle: number) {
    this.context!.beginPath();
    this.context!.arc(x, y, radius, startAngle, endAngle);
    this.context!.stroke();
  }

  private setCanvasDimension(): void {
    //let parent: any = this.canvas.nativeElement.parentElement.parentElement.parentElement.classList;
    let parentWidth: number = this.canvas.nativeElement.parentElement.parentElement.parentElement.clientWidth;
    let parentHeight: number = this.canvas.nativeElement.parentElement.parentElement.parentElement.clientHeight;
    //let cHeight: number = this.canvas.nativeElement.parentElement.clientHeight;
    this.canvas.nativeElement.width = parentWidth;
    this.canvas.nativeElement.height = parentHeight - 1;
    // console.log(`c height ${cHeight}`)
    // console.log(`parent: ${parent} \n parentW: ${parentWidth}, parentH: ${parentHeight} \n canvasW: ${this.canvas.nativeElement.width}, canvasH: ${this.canvas.nativeElement.height}`)
  }

  private drawBoat(centerX: number, centerY: number, color?: boolean): void {
    this.context!.save();
    // disegno la parte destro
    this.context!.beginPath()
    this.context!.lineWidth = 3;
    this.context!.strokeStyle = color ? "green" : "black";
    // fisso il punto di prua
    this.context!.moveTo(centerX, centerY - 140)
    this.context!.quadraticCurveTo(centerX + 70, centerY - 100, centerX + 50, centerY + 40 );
    this.context!.lineTo(centerX, centerY + 40)
    this.context!.stroke();
    this.context!.fillStyle = "white";
    this.context!.fill();
    // disegno la parte sinistra
    this.context!.beginPath();
    this.context!.strokeStyle = color ? "red" : "black";
    this.context!.moveTo(centerX, centerY - 140)
    this.context!.quadraticCurveTo( centerX - 70, centerY - 100, centerX - 50, centerY + 40 );
    this.context!.lineTo(centerX, centerY + 40)
    this.context!.stroke();
    this.context!.fillStyle = "white";
    this.context!.fill();

    this.context!.restore();
  }

  private drawAngleIndicator(angle: number) {
    let centerX: number = this.canvas!.nativeElement.width / 2;
    let centerY: number = this.canvas!.nativeElement.height / 2;
    let radius: number = this.canvas!.nativeElement.height * 0.37;

    this.context!.setTransform(1, 0, 0, 1, centerX, centerY);
    this.context!.rotate(this.degreeToRadians(angle));
    this.context!.translate(0, radius); // sono sulla circonferenza
    
    this.context!.beginPath();
    this.context!.moveTo(0, 0); // 0, 0 è l'attuale posizione sulla circonferenza
    this.context!.lineTo(0, -10);
    this.context!.stroke();
  }

  drawAnglesIndicators(xSign: number, text:string, customOffset?: number, direction?: string) {
    let centerX: number = this.canvas!.nativeElement.width / 2;
    let centerY: number = this.canvas!.nativeElement.height / 2;
    let radius: number = this.canvas!.nativeElement.height * 0.4;
    let offSet: number = 20;
    if (direction !== null && direction === 'horizontal') {
      let designatedWidth: number = centerX + (xSign * radius) + (xSign * offSet);
      this.context!.font = '30px sans-serif';
      this.context!.fillStyle = 'black';
      this.context!.textAlign = 'center';
      this.context!.fillText(text, designatedWidth, centerY);
    } else {
      let designatedHeight: number = centerY + (xSign * radius);
      designatedHeight += customOffset !== undefined ? (xSign * customOffset) : (xSign * offSet);
      this.context!.fillStyle = 'black';
      this.context!.textAlign = 'center';
      this.context!.fillText(text, centerX, designatedHeight);
    }
  }

  drawSegments(radius: number, angle: number) {
    //this.context!.clearRect(0, 0, this.canvas!.nativeElement.width, this.canvas!.nativeElement.height);
    let x: number = this.canvas!.nativeElement.width / 2;
    let y:number = this.canvas!.nativeElement.height / 2;
    let hours: number = 32;
    let pieAngle: number = (2 * Math.PI) / hours;
    let segmentDepth: number = 150;
    let angleToRadians = this.degreeToRadians(angle);
    
    if (angleToRadians >= 0) {
      for (var i = 0; i < hours; i++) {
        this.context!.beginPath();
        this.context!.moveTo(x, y);
        let startAngle: number = (i * pieAngle);
        let endAngle: number = ((i + 1) * pieAngle);
        // fix for first slice: if angleToRadians is <= then pieAngle
        if (angleToRadians <= pieAngle) {
          this.context!.arc(x, y, radius, 0 - Math.PI / 2, pieAngle - Math.PI / 2);
          this.context!.lineWidth = segmentDepth;
          this.context!.fillStyle = 'gainsboro';
          this.context!.fill();
          this.context!.lineWidth = 2;
          this.context!.strokeStyle = '#444';
          this.context!.stroke();
        }
        if (endAngle <= angleToRadians) {
          this.context!.arc(x, y, radius, startAngle - Math.PI / 2, endAngle - Math.PI / 2);
          this.context!.lineWidth = segmentDepth;
          this.context!.fillStyle = 'gainsboro';
          this.context!.fill();
          this.context!.lineWidth = 2;
          this.context!.strokeStyle = '#444';
          this.context!.stroke();
        }
      }
    } else {
      /**
       * ANGLE IS NEGATIVE 
       */
      for (var i = 0; i < hours; i++) {
        this.context!.beginPath();
        this.context!.moveTo(x, y);
        let startAngle: number = (-i * pieAngle);
        let endAngle: number = ((-i - 1) * pieAngle);
        if (angleToRadians >= -1 * pieAngle) {
          console.log(`exec`);
          this.context!.arc(x, y, radius, 0 - Math.PI / 2, (- Math.PI / 2) - pieAngle, true);
          this.context!.lineWidth = segmentDepth;
          this.context!.fillStyle = 'gainsboro';
          this.context!.fill();
          this.context!.lineWidth = 2;
          this.context!.strokeStyle = '#444';
          this.context!.stroke(); 
        }
        if (endAngle >= angleToRadians) {
          this.context!.arc(x, y, radius, startAngle - (Math.PI / 2), (- Math.PI / 2) + endAngle, true);
          this.context!.lineWidth = segmentDepth;
          this.context!.fillStyle = 'gainsboro';
          this.context!.fill();
          this.context!.lineWidth = 2;
          this.context!.strokeStyle = '#444';
          this.context!.stroke(); 
        }
      }
    }

  }

  private degreeToRadians(angle: number) {
    return angle * (Math.PI / 180);
  }

}
