import { Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild, Renderer2 } from '@angular/core';
import { Subscription } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { ApiService } from '../../../../../services/api.service';

declare const Terminal: any;

@Component({
  selector: 'app-basic-terminal',
  templateUrl: './basic-terminal.component.html',
  styleUrls: ['./basic-terminal.component.scss']
})
export class BasicTerminalComponent implements OnInit, OnDestroy {
  @ViewChild('terminal') terminalElement: ElementRef<HTMLDivElement>;
  @ViewChild('dialogContent') dialogContentElement: ElementRef<HTMLDivElement>;
  private terminal: any;
  private subscription: Subscription;

  constructor(
    public dialogRef: MatDialogRef<BasicTerminalComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private renderer: Renderer2,
    private apiService: ApiService,
    private translate: TranslateService,
  ) { }

  ngOnInit() {
    this.terminal = new Terminal(null);
    this.terminal.setWidth('100%');
    this.terminal.setBackgroundColor('black');
    this.terminal.setTextSize('15px');
    this.terminal.blinkingCursor(true);
    this.renderer.appendChild(this.terminalElement.nativeElement, this.terminal.html);

    this.waitForInput();
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  focusTerminal() {
    this.terminal.html.click();
  }

  private waitForInput() {
    this.terminal.input(this.translate.instant('actions.terminal.input-start', { address: this.data.addr }), (input) => {
      this.subscription = this.apiService.post(`exec/${this.data.pk}`, { command: input }, { api2: true, type: 'json' })
      .subscribe(response => {
        if (response.output) {
          this.printLines(response.output);
        } else {
          this.printLines(this.translate.instant('actions.terminal.error'));
        }

        this.printLines(' ');
        this.waitForInput();
      }, error => {
        if (error.error && error.error.error && typeof error.error.error === 'string') {
          this.printLines(error.error.error);
        } else {
          this.printLines(this.translate.instant('actions.terminal.error'));
        }

        this.printLines(' ');
        this.waitForInput();
      });
    });
  }

  private printLines(text: string) {
    let processedText = text.replace(/</g, '&lt;');
    processedText = processedText.replace(/>/g, '&gt;');
    processedText = processedText.replace(/\n/g, '<br/>');
    processedText = processedText.replace(/\t/g, '&emsp;');
    processedText = processedText.replace(/ /g, '&nbsp;');

    this.terminal.print(processedText);

    setTimeout(() => {
      this.dialogContentElement.nativeElement.scrollTop = this.dialogContentElement.nativeElement.scrollHeight;
    });
  }
}
