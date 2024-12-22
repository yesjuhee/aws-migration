// 카드에 대한 정보를 저장하는 배열
const cardArray = [
    {
        name: "cat1",
        img: "./public/cat1.jpg",
        id: null,
        isDone: false
    },
    {
        name: "cat1",
        img: "./public/cat1.jpg",
        id: null,
        isDone: false
    },
    {
        name: "cat2",
        img: "./public/cat2.jpg",
        id: null,
        isDone: false
    },
    {
        name: "cat2",
        img: "./public/cat2.jpg",
        id: null,
        isDone: false
    },
    {
        name: "cat3",
        img: "./public/cat3.jpg",
        id: null,
        isDone: false
    },
    {
        name: "cat3",
        img: "./public/cat3.jpg",
        id: null,
        isDone: false
    },
    {
        name: "cat4",
        img: "./public/cat4.jpg",
        id: null,
        isDone: false
    },
    {
        name: "cat4",
        img: "./public/cat4.jpg",
        id: null,
        isDone: false
    },
    {
        name: "cat5",
        img: "./public/cat5.jpg",
        id: null,
        isDone: false
    },
    {
        name: "cat5",
        img: "./public/cat5.jpg",
        id: null,
        isDone: false
    },
    {
        name: "cat6",
        img: "./public/cat6.jpg",
        id: null,
        isDone: false
    },
    {
        name: "cat6",
        img: "./public/cat6.jpg",
        id: null,
        isDone: false
    },
    {
        name: "cat7",
        img: "./public/cat7.jpg",
        id: null,
        isDone: false
    },
    {
        name: "cat7",
        img: "./public/cat7.jpg",
        id: null,
        isDone: false
    },
    {
        name: "cat8",
        img: "./public/cat8.jpg",
        id: null,
        isDone: false
    },
    {
        name: "cat8",
        img: "./public/cat8.jpg",
        id: null,
        isDone: false
    }
]
// row, column DOM을 2차원 배열로 저장
const gameDOM = []
let openCard1 = -1
let openCard2 = -1
let openCardCount = 0
let doneCardCount = 0
let startTime = 0
let endTime = 0
let spendTime = 0

// 페이지 로드시 세팅되는 함수
// 게임 돔을 받아오는 함수 (2차원 노드리스트), parsing
const getGameDOM = () => {
    const rows = document.querySelectorAll(".container .row") // row 3개의 dom 정보
    for (let i = 0; i < rows.length; i++) {
        gameDOM[i] = rows[i].querySelectorAll(".column")
    }
}
// cardArray가 랜덤 sort된 후 위치 정보 부여
const setIDtoCardArray = () => {
    cardArray[0].id = "0-0"
    cardArray[1].id = "0-1"
    cardArray[2].id = "0-2"
    cardArray[3].id = "0-3"
    cardArray[4].id = "1-0"
    cardArray[5].id = "1-1"
    cardArray[6].id = "1-2"
    cardArray[7].id = "1-3"
    cardArray[8].id = "2-0"
    cardArray[9].id = "2-1"
    cardArray[10].id = "2-2"
    cardArray[11].id = "2-3"
    cardArray[12].id = "3-0"
    cardArray[13].id = "3-1"
    cardArray[14].id = "3-2"
    cardArray[15].id = "3-3"
}
// 초기 카드 세팅
const createBoard = () => {
    for (let i = 0; i < gameDOM.length; i++) {
        for (let j = 0; j < gameDOM[i].length; j++){
            const card = document.createElement("img")
            card.setAttribute("src", cardArray[i*4+j].img)
            // card.classList.add("backImage")
            gameDOM[i][j].appendChild(card)
        }
    }
}
// 모두 뒤집기
const backFlipAll = () => {
    for (let i = 0; i < gameDOM.length; i++) {
        for (let j = 0; j < gameDOM[i].length; j++){
            gameDOM[i][j].querySelector("img").src = "./public/scg.png"
        }
    } 
}
// 페이지가 로드 됐을 때 실행되는 함수, 오버라이딩
onload = async () => {
    const start = new Date()
    startTime = start.getTime()

    // 람다로부터 랜덤 카드 결과 받아오기
    const response = await fetch("https://moy6dkppye.execute-api.ap-northeast-2.amazonaws.com/card-flip-gaem-gateway/randomize");
    const data = await response.json();
    const shuffledCards = JSON.parse(data.body).shuffled;

    // cardArray 업데이트
    for (let i = 0; i < cardArray.length; i++) {
        cardArray[i].name = shuffledCards[i].name;
        cardArray[i].img = shuffledCards[i].img;
    }

    getGameDOM();
    cardArray.sort(() => 0.5 - Math.random())
    setIDtoCardArray()
    createBoard()
    setTimeout(backFlipAll, 3000)
}

// 재시작 기능
const restart = () => {
    window.location.reload()
}


// 카드 클릭시 작동되는 함수들
// 열려있는 카드의 정보 저장
const setClickHistory = (location) => {
    if (openCard1 == -1) {
        openCard1 = location
    } else {
        openCard2 = location
    }
}
// 열려있는 함수 뒤집기
const backFlip = () => {
    const parsedIdFirst = cardArray[openCard1].id.split("-")
    const parsedIdSecond = cardArray[openCard2].id.split("-")
    setTimeout(() => {
        gameDOM[parsedIdFirst[0]][parsedIdFirst[1]].querySelector("img").src = 
        "./public/scg.png"
        gameDOM[parsedIdSecond[0]][parsedIdSecond[1]].querySelector("img").src = 
        "./public/scg.png"
    }, 500)
}
// 열려있는 두 카드의 짝이 맞는지 확인
const isCorrect = () => {
    if (cardArray[openCard1].name === cardArray[openCard2].name) {
        cardArray[openCard1].isDone = true
        cardArray[openCard2].isDone = true
        doneCardCount += 2
    }else{
        backFlip()
    }
}

const gameOver = () => {
    spendTime = (endTime - startTime) / 1000
    let comment 
    result = confirm(`성공입니다! ${spendTime}초 걸렸습니다.\n재시작하시겠습니까?`)
    if (result) {
        restart()
    }
}

// 카드를 눌렀을 때 실행되는 함수
const flip = (location) => {
    // 예외 처리
    if (cardArray[location].isDone) {
        return
    }
    if (location === openCard1) {
        return
    }

    setClickHistory(location)
    
    // 클릭된 카드 뒤집기
    const parseID = cardArray[location].id.split("-")
    gameDOM[parseID[0]][parseID[1]].querySelector("img").src = 
        cardArray[location].img
    
    // 오픈된 카드의 짝 확인
    openCardCount++ 
    if (openCardCount === 2) {
        openCardCount = 0
        isCorrect()
        openCard1 = -1
        openCard2 = -1
    }

    // 게임 오버
    if (doneCardCount == cardArray.length) {
        const end = new Date
        endTime = end.getTime()
        setTimeout(gameOver, 500)
    }
}


// 추가 기능 : 게임 시간 측정하여 유저에게 알려줌