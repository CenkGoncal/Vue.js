	
	Vue.component('musteri-adi',{
		
		data: function () {
			return {
			  musteriadi: ""
			}
		  },		 
		 methods: {
			onchange()
			{
				console.log(this.musteriadi);
				this.$emit('onchangemusteri',this.musteriadi);
			}
		 },
		 template:`
			<div class="row">					
				<div class="form-floating" style="margin-bottom:5px">
					<input type="text" class="form-control" id="floatingMusteri" v-model=musteriadi  @change="onchange">
					<label for="floatingMusteri">Müşteri İsmi</label>
				</div>
			</div>`
	});
	
	Vue.component('siparis-adet',{
		
		data: function () {
			return {
			  siparisAdet: 0
			}
		  },		
		 methods: {
			onchange()
			{
				console.log(this.siparisAdet);
				this.$emit('onchangeadet',this.siparisAdet);
			}
		 },
		 template:`
			<div class="row">
					
				<div class="form-floating" style="margin-bottom:5px">
					<input type="number" class="form-control" id="floatingAdet" placeholder="Sipariş Çeşit Adet" v-model=siparisAdet  @change="onchange">
					<label for="floatingAdet">Sipariş Çeşit Adet</label>
				</div>
			</div>`
	});
	
	Vue.component('yemek-sec',{
		 props:{
			cart:{
				type:Array,
				required: true
			},
			cesitno:{
				type:Number,
				required: true
			}			
		 },
		  data: function () {
			return {
			  cesit: ""
			}
		  },			  
		  methods: {
			onchangeselect()
			{
				console.log(this.cesit);
				this.$emit('onchangecesit',this.cesitno,this.cesit);
			}
		 },
		 template:`
		 <div class="row">
			<div class="form-floating" style="margin-bottom:5px">
			  <select class="form-select" id="floatingSelect" aria-label="Floating label select example" v-model=cesit @change="onchangeselect">
				<option disabled selected>Yemek Çeşit Seçin</option>
				<option class="item" v-for="(item, index) in cart">
					{{ item.text }}
				</option>				
			  </select>
			  <label for="floatingSelect">{{ cesitno }}.Çeşit</label>
			</div>
		</div>`
	});
	
	Vue.component('modal-cesit',{
		 props:{
			cesit:{
				type:Array,
				required: true
			}		
		 },
		 methods: {
			onAddCesit()
			{								
				this.$emit('addcesit');
			},
			onRemoveCesit(index)
			{
				this.cesit.splice(index,1);
				this.$emit('removecesit',index);
			}
		 },
		 template:`
		<div class="modal fade" id="cesitModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
		  <div class="modal-dialog">
			<div class="modal-content">
			  <div class="modal-header">
				<div class="modal-title" id="exampleModalLabel">
					<label>Çeşit İsimleri </label>
					<button class="btn btn-success" @click="onAddCesit">Ekle</button>
				</div>
				<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
			  </div>
			  <div class="modal-body">
					<table class="table table-striped">
					  <thead>
						<tr>
						  <th scope="col">#</th>
						  <th scope="col">Çeşit</th>	
						  <th scope="col">X</th>
						</tr>
					  </thead>
					  <tbody>
						<tr v-for="(item,index) in cesit">
							<td>{{ item.id }}</td>
							<td>{{ item.text }}</td>
							<td><button class="btn btn-danger" @click="onRemoveCesit(index)">Sil</button></td>
						</tr>
					  <tbody>
					</table>
			  </div>
			</div>
		  </div>
		</div>
		`
	});
		
	Vue.component('modal-pdf',{
		 data: function () {
			return {
			  height: 3,
			  width :5,
			  src : ""
			}
		 },		 
		 props:{
			print:{
				type:Object,
				required: true
			}		
		 },	 
		 methods: {
			 previewPdf(IsDownload)
			 {
				let doc = jsPDF('l', 'cm', [this.height, this.width]);
				doc.setFontSize(6);
				doc.text(0, 0.5, 'Mst:'+this.print.musteriIsmi);
				doc.text(3.5, 0.5, this.print.tutar+' TL');
				doc.setLineWidth(0);
				doc.line(0, 0.6, 5, 0.6);
				
				let startsatir = 0.8;
				for(let i=0; i<this.print.cesit.length; i++)
				{
					if(this.print.cesit[i] == undefined)
						continue;
					console.log(this.print.cesit[i]);
					doc.text(0, startsatir, (i+1)+"."+this.print.cesit[i]);
					startsatir += 0.2;
				}
				
				if(!IsDownload)
					this.src = doc.output('datauristring');									
				else
				doc.save('Test.pdf');				
			 }
		 },		
		 template:`
		<div class="modal fade" id="etiketModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
		  <div class="modal-dialog">
			<div class="modal-content">
			  <div class="modal-header">
				<h3 class="modal-title" id="etiketModalLabel">
					<label>Etiket Önizleme </label>
					<button class="btn btn-info"><i class="fa fa-refresh fa-spin" style="font-size:24px color:green" @click="previewPdf(false)"></i></button>
				</h3>
				<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
			  </div>
			  <div class="modal-body">
				  <iframe id="pdf_preview" type="application/pdf" :src="src" width="400" height="200"></iframe>				  
				  
			  </div>
			  <div class="modal-footer col-sm-12">
					<div class="form-floating col-sm-3">
						<input type="number" class="form-control" id="floatingheight" v-model="height">
						<label for="floatingheight">Yükseklik</label>
					</div>
					<div class="form-floating col-sm-3">
						<input type="number" class="form-control" id="floatingwidth" v-model="width">
						<label for="floatingwidth">Genişlik</label>
					</div>
					<button class="btn btn-success col-sm-5" @click="previewPdf(true)" >Yazdir</button>
			  </div>
			</div>
		  </div>
		</div>
		`,	
	 created()
	  {	
		console.log(this.print);			
		
	  }
	});
		
	window.addEventListener('load',() => {
	
		window.app = new Vue({
			  el: '#app',
			  data: {		
				yemekList :[ {id:1,text:'Çorba' },
							 {id:2,text:'Patlıcan Kebabı'},
							 {id:3,text:'Makarna'}
						   ],
				yemekListArray : [],
				printinfo : {
								musteriIsmi : "",
								cesit : [],
								tutar : 0				
							},
				tarifeId : ''
			  },
			  methods:
			  {
				createCesitCombo(Topadet)
				{	
					
					if(this.printinfo.cesit.length > 0)
					{
						if(this.printinfo.cesit.length > Topadet)
							this.printinfo.cesit.splice(Topadet,this.printinfo.cesit.length - Topadet);
					}
															
					
					this.yemekListArray = [];
					this.printinfo.tutar = 0;			
					for(var i = 0;  i < Topadet; i++)
					{
						this.yemekListArray.push(this.yemekList);
					}
				},
				changeMusteri(musteriAdi)
				{
					
					this.printinfo.musteriIsmi = musteriAdi;
				},
				changecesit(index,yemekIsmi)
				{
					if(yemekIsmi != null)
					{					
						this.printinfo.cesit[index-1] = yemekIsmi;
						this.tutarHesapla();
					}					
				},
				tutarHesapla() 
				{
				  if(this.printinfo.cesit.length == 1)
				  {
					  if(this.tarifeId == "1")
						  this.printinfo.tutar = 15; 
					  else
					  if(this.tarifeId == "2")
						  this.printinfo.tutar = 18; 
					  else
					  if(this.tarifeId == "3")
						  this.printinfo.tutar = 19.5; 
					  else
					  if(this.tarifeId == "4")
						  this.printinfo.tutar = 15; 
				  }
				  else
				  if(this.printinfo.cesit.length == 2)
				  {

					  if(this.tarifeId == "1")
						  this.printinfo.tutar = 17; 
					  else
					  if(this.tarifeId == "2")
						  this.printinfo.tutar = 19.5; 
					  else
					  if(this.tarifeId == "3")
						  this.printinfo.tutar = 21; 
					  else
					  if(this.tarifeId == "4")
						  this.printinfo.tutar = 15; 
				  }
				  else
				  if(this.printinfo.cesit.length == 3)
				  {
					  if(this.tarifeId == "1")
						  this.printinfo.tutar = 18.5; 
					  else
					  if(this.tarifeId == "2")
						  this.printinfo.tutar = 21; 
					  else
					  if(this.tarifeId == "3")
						  this.printinfo.tutar = 22.5; 
					  else
					  if(this.tarifeId == "4")
						  this.printinfo.tutar = 15; 
				  }
				  else
				  if(this.printinfo.cesit.length == 4)
				  {			  
					  if(this.tarifeId == "1")
						  this.printinfo.tutar = 20; 
					  else
					  if(this.tarifeId == "2")
						  this.printinfo.tutar = 22.5; 
					  else
					  if(this.tarifeId == "3")
						  this.printinfo.tutar = 24; 
					  else
					  if(this.tarifeId == "4")
						  this.printinfo.tutar = 15; 
				  }				  				 
				},				
				createNewCesit()
				{
					let cesit =  prompt('Çeşit İsmini Giriniz');
					if( (cesit != "") && (cesit != null) )
					{   
						let lastId = this.yemekList[this.yemekList.length -1].id + 1;
						let find = false;
						for(var i = 0; i < this.yemekList.length; i++)
						{
							if(this.yemekList[i].text.toUpperCase() == cesit.toUpperCase())
							{
								find = true;
								break;								
							}
						}
						
						if(find)
						{
							alert("Daha Önceden Eklemişsiniz");
						}
						else
						{
							this.yemekList.push({id:lastId,text: cesit });							
						}
					}
				},
				createRemoveCesit(index)
				{					
					this.yemekList.splice(index,1);
				}
			  },	  
			  computed: {

			  },			  
			 created()
			  {
				//const fs = require('fs');
			  }
			})
	});
	