/*-----DOM綁定-----*/
const ticketCardPrint = document.querySelector('.ticketCardPrint-js');

const changeSearch = document.querySelector('.changeSearch-js');
const dataNum = document.querySelector('.dataNum-js');



const addTicketObject = {};

addTicketObject.ticketName = document.querySelector('#ticketName');
addTicketObject.ticketImgUrl = document.querySelector('#ticketImgUrl');
addTicketObject.ticketRegion = document.querySelector('#ticketRegion');
addTicketObject.ticketPrice = document.querySelector('#ticketPrice');
addTicketObject.ticketNum = document.querySelector('#ticketNum');
addTicketObject.ticketRate = document.querySelector('#ticketRate');
addTicketObject.ticketDescription = document.querySelector('#ticketDescription');

const addTicketArray = Object.keys(addTicketObject);

const addTicketBtn = document.querySelector('.addTicket-btn-js');


/*-----本地資料-----*/
let data = [
	{
		"id": 0,
		"name": "綠島自由行套裝行程",
		"imgUrl": "https://i.imgur.com/QXa1fMZ.png",
		"area": "高雄",
		"description": "嚴選超高CP值綠島自由行套裝行程，多種綠島套裝組合。",
		"group": 87,
		"price": 1400,
		"rate": 10
	},
	{
		"id": 1,
		"name": "清境高空觀景步道",
		"imgUrl": "https://i.imgur.com/4UHm8WX.png",
		"area": "台北",
		"description": "清境農場青青草原數十公頃碧草，這些景觀豐沛了清境觀景步道的風格，也涵養它無可取代的特色。",
		"group": 99,
		"price": 240,
		"rate": 2
	},
	{
		"id": 2,
		"name": "山林悠遊套票",
		"imgUrl": "https://i.imgur.com/H97Wgfn.png",
		"area": "台中",
		"description": "山林悠遊套票，結合南投清境高空步道、雙龍瀑布七彩吊橋、瑞龍瀑布園區之熱門景點。",
		"group": 20,
		"price": 1765,
		"rate": 7
	}
];


/*-----函式-----*/

//取得axios的json資料
function init() {
	axios.get('https://raw.githubusercontent.com/hexschool/js-training/main/travelApi.json')
		.then(function (response) {
			let axiosArray = response.data.data;
			integration(axiosArray); //傳遞資料
			
		});
}

//將新資料跟本地資料合併
function integration(newArray){
	newArray.forEach(function(item,index){
		item.id = data.length; //將新的資料id重新賦予
		data.push(item);//將新的資料push進本地data
	})
	console.log('目前data:',data);
	showData(data); //秀出套票
	showChart(data);//秀出圖表
}


//將資料渲染進DOM上 (其實這裡不需要帶上參數,但為了能重複使用讓過濾後的資料丟進來所以加上)
function showData(data){
	let str = '';
	data.forEach(function(item,index){
		let content = `<li class="ticketCard">
				<div class="ticketCard-img">
					<a href="#">
						<img src="${item.imgUrl}" alt="">
					</a>
					<div class="ticketCard-region">${item.area}</div>
					<div class="ticketCard-rank">${item.rate}</div>
				</div>
				<div class="ticketCard-content">
					<div>
						<h3>
							<a href="#" class="ticketCard-name">${item.name}</a>
						</h3>
						<p class="ticketCard-description">
							${item.description}
						</p>
					</div>
					<div class="ticketCard-info">
						<p class="ticketCard-num">
							<span><i class="fas fa-exclamation-circle"></i></span>
							剩下最後 <span id="ticketCard-num"> ${item.group} </span> 組
						</p>
						<p class="ticketCard-price">
							TWD <span id="ticketCard-price">$${item.price}</span>
						</p>
					</div>
				</div>
			</li>`;

		str += content;
	})
	
	ticketCardPrint.innerHTML = str;
}

//資料驗證(目前只有判斷是否是空值 與 套票星級)
function verification() {
	
	let errorNum = 0;
	//若為空值的增加class
	addTicketArray.forEach(function (item, index) {
		if (addTicketObject[item].value == '') {
			addTicketObject[item].setAttribute('class', 'danger-border');
			errorNum++;
		}

		addTicketObject[item].addEventListener('focusout', function (e) {
			if (!(addTicketObject[item].value == '')) {
				addTicketObject[item].removeAttribute('class', 'danger-border');
			}
		});
	})

	if (errorNum == 0) {
		if (1 <= addTicketObject.ticketRate.value && addTicketObject.ticketRate.value <= 10) {
			addTicketObject.ticketRate.removeAttribute('class', 'danger-border');
			return '正確';
		} else {
			addTicketObject.ticketRate.setAttribute('class', 'danger-border');
			return '套票星級 請輸入正確(1~10)';
		}
	} else {
		return `請正確輸入資料，目前有 ${errorNum} 個錯誤`;
	}


}

//整理資料秀出D3圖表
function showChart(data) {
	// 篩選地區，並累加數字上去
	// totalObj 會變成 {高雄: 1, 台北: 1, 台中: 2}
	let totalObj = {};
	data.forEach(function (item, index) {
		if (totalObj[item.area] == undefined) {
			totalObj[item.area] = 1;
		} else {
			totalObj[item.area] += 1;
		}

	})

	// newData = [["高雄", 1], ["台北",1], ["台中", 1]]
	let newData = [];
	let area = Object.keys(totalObj);
	// area output ["高雄","台北","台中"]
	area.forEach(function (item, index) {
		let ary = [];
		ary.push(item);
		ary.push(totalObj[item]);
		newData.push(ary);
	})
	console.log( 'D3內資料:', newData);
	// 將 newData 丟入 c3 產生器
	const chart = c3.generate({
		bindto: "#chart",
		size: {
			height: 200
		},
		data: {
			columns: newData,
			type: 'donut',
			colors: {
				'高雄': '#E68618',
				'台北': '#26C0C7',
				'台中': '#5151D3'
			},
		},
		donut: {
			title: "套票地區比重",
			label: {
				show: false //取消上面的標籤
			},
			width: 10 //調整寬度
		}
	});
}




/*-----執行-----*/
init();



/*-----監聽-----*/

//地區select選擇
changeSearch.addEventListener('change',function(e){
	if(this.value == '全部地區'){
		showData(data);
		dataNum.textContent = `本次搜尋共 ${data.length} 筆資料`;
	}else{
		//這裡故意練習filter跟箭頭函式來做 (可以使用forEach + if)
		let newData = data.filter(item => item.area == this.value);
		showData(newData);
		dataNum.textContent = `本次搜尋共 ${newData.length} 筆資料`;
	}
})

//新增套票
addTicketBtn.addEventListener('click', function (e) {
	let isTrue = verification(); //資料驗證
	if (isTrue == '正確') {
		alert('成功增加資料!');
		let addData = [{	
			"id": data.length,
			"name": addTicketObject.ticketName.value,
			"imgUrl": addTicketObject.ticketImgUrl.value,
			"area": addTicketObject.ticketRegion.value,
			"description": addTicketObject.ticketDescription.value,
			"group": addTicketObject.ticketNum.value,
			"price": addTicketObject.ticketPrice.value,
			"rate": addTicketObject.ticketRate.value
		}];
		integration(addData);
		//將填寫的資料刪除
		addTicketArray.forEach(function(item){
			addTicketObject[item].value = '';
		})

	} else {
		alert(isTrue);
	}
})

