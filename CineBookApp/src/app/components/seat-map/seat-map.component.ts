import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Seat } from '../../interfaces/Seat';
import { SeatService } from '../../services/Seat/seat.service'; 
declare var bootstrap: any;
@Component({
  selector: 'app-seat-map',
  templateUrl: './seat-map.component.html',
  styleUrls: ['./seat-map.component.css']
})
export class SeatMapComponent implements OnInit {
  seatData: { [row: string]: Seat[] } = {};
  showtimeId!: number;
  showPopUp = true;
  seatCols = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  normalRows: string[] = [];
  selectedSeatCount: number = 0;
  executiveRows: string[] = [];
  premiumRows: string[] = [];
  bookedSeatLabels: string[] = [];
  //selectedSeatLabels: string[] = [];
  selectedSeatLabels = new Set<number>();
  selectSeatCount(count: number): void {
    this.selectedSeatCount = count;
    this.showPopUp = false;
  }
  tierPrices = {
    Premium: 700,
    Executive: 440,
    Normal: 420
  };
  tiers = {
    Premium: ['L', 'M'],
    Executive: ['H', 'I', 'J', 'K'],
    Normal: ['A', 'B', 'C', 'D', 'E', 'F', 'G']
  };
  maxSelectedSeats: number = 0;

  modalInstance: any;
  constructor(private seatService: SeatService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.showModalOnLoad();
    this.showtimeId = Number(this.route.snapshot.paramMap.get('showtimeId'));

    if (!this.showtimeId || this.showtimeId <= 0) return;
    this.seatService.getSeatsByShowTime(this.showtimeId).subscribe(data => {
      this.seatData = data;
      console.log(data);

      this.premiumRows = Object.keys(data).filter(r => ['L', 'M'].includes(r)).reverse();
      this.executiveRows = Object.keys(data).filter(r => ['H', 'I', 'J', 'K'].includes(r)).reverse();
      this.normalRows = Object.keys(data).filter(r => ['A', 'B', 'C', 'D', 'E', 'F', 'G'].includes(r)).reverse();

      console.log(this.seatData);
      console.log(this.premiumRows);
      console.log(Object.keys(this.seatData));
    });
    const modal = bootstrap.Modal.getInstance(document.getElementById('seatCountModal')!);
    modal?.show();

  }
  openModal(): void {
    if (this.modalInstance) {
      this.modalInstance.show();
    }
  }
  ngAfterViewInit(): void {
    // Ensure Bootstrap modal functionality works after view is initialized
    const modalElement = document.getElementById('seatCountModal');
    if (modalElement) {
      this.modalInstance = new bootstrap.Modal(modalElement);
      this.openModal();
    }
  }
  showModalOnLoad() {
    //const modal = document.getElementById('seatCountModal');
    //if (modal) {
    //  modal.style.display = 'block';
    //  modal.classList.add('show');
    //  document.body.classList.add('modal-open');
    //}
  }

  toggleSeat(label: number): void {

    if (this.isBooked(label)) return;

    if (this.selectedSeatLabels.has(label)) {
      this.selectedSeatLabels.delete(label);
    } else if (this.selectedSeatLabels.size < this.selectedSeatCount) {
      this.selectedSeatLabels.add(label);
    } else {
      this.selectedSeatLabels = new Set<number>();
      this.selectedSeatLabels.add(label);
    }
  }
  isSeatCountPopUpVisible: boolean = true;
  isBooked(label: number): boolean {
    return this.seatData && Object.values(this.seatData).flat().some(seat => seat.seatId === label && seat.isOccupies);
  }
  isSelected(label: number): boolean {
    return this.selectedSeatLabels.has(label);
  }
  confirmSeatCount(): void {
    if (this.selectedSeatCount > 0) {
      this.isSeatCountPopUpVisible = false;
      this.closeModal();
    }
  }
  closeModal(): void {
    if (this.modalInstance) {
      this.modalInstance.hide();
    }
  }
  getTotalPrice(): number {
    let total = 0;
    for (let seat of this.selectedSeatLabels) {
      const seatObj = this.findSeatById(seat);
      if (seatObj) {
        total += seatObj.price;
      }
    }
    return total;
  }


  findSeatById(seatId: number): Seat | undefined {
    for (const rowSeats of Object.values(this.seatData)) {
      const seat = rowSeats.find(s => s.seatId === seatId);
      if (seat) return seat;
    }
    return undefined;
  }
  proceedToPayment(): void {
    const selectedSeats = Array.from(this.selectedSeatLabels).map(id => this.findSeatById(id));
    console.log('Proceeding with seats:', selectedSeats);
    console.log('Total Price:', this.getTotalPrice());
    sessionStorage.setItem("seats", JSON.stringify(selectedSeats));
    this.router.navigate(['/booking', this.showtimeId]);
    // Navigate to payment or confirmation page here
  }
  openSeatCountModal(): void {
    // Don’t reset selectedSeatCount — we want to keep the old value

    // Optionally clear selected seats if you want them to re-select, or keep them as is
    // this.selectedSeatLabels.clear();

    const modalElement = document.getElementById('seatCountModal');
    if (modalElement) {
      this.modalInstance = bootstrap.Modal.getOrCreateInstance(modalElement);
      this.modalInstance.show();
    }
  }

  goBack(): void {
    this.router.navigate(['viewShowTiming', this.showtimeId]);
  }


}
