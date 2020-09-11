const game = document.querySelector(".game");
const h2 = document.querySelector("h2")
const h1 = document.querySelector("h1")

const createGame = (c, m) => {
    const rows = 10;
    const cols = c;
    const mines = m;

    game.innerHTML = '';
    h2.innerText = 'Game status';
    h1.innerText = `Mines : ${mines}`

    const cells = Array(rows).fill(null).map(r => Array(cols).fill(""))

    for(let i = 0; i < mines; i++){
        let x,y;
        do{
            x = Math.floor(Math.random() * rows)
            y = Math.floor(Math.random() * cols)
        } while(cells[x][y])
        cells[x][y] = "Mine"
    }
    cells.map((row, k) => {
        row.map((cell, j) => {
            if(!cell){
                let n = [[k-1,j],[k+1,j],[k,j+1],[k,j-1],[k+1,j+1],[k-1,j-1],[k+1,j-1],[k-1,j+1]];
                let c = 0;
                for(var i = 0; i < n.length ; i++){
                    const [x, y] = n[i];
                    if(x < 0 || y < 0 || x >= rows || y >= cols) continue
                    if(cells[x][y] === "Mine") c++
                }
                cells[k][j] = c
                
            }
            const box = document.createElement("div")
            box.className = 'box'
            box.style.width = cols == 5 ? "20%" : "10%"
            box.id = `${k}${j}`
            box.setAttribute("data-value", cells[k][j] == 0 ? "" : cells[k][j])
            game.appendChild(box)
        }) 
    })

    const extend = (id) => {
        const x = Number(id[0])
        const y = Number(id[1])
        const theCell = document.getElementById(id);
        const nei = [[x+1, y] ,[x-1, y], [x, y+1], [x, [y-1]], [x+1, y+1], [x+1, y-1], [x-1, y+1], [x-1, y-1]];
        for(let n of nei){
            let hisId = `${n[0]}${n[1]}`
            if(n[0] < 0 || n[1] < 0 || n[0] >= rows || n[1] >= cols) continue
            let neighbour = document.getElementById(`${hisId}`);
            if(!theCell.dataset.value && !neighbour.classList.contains("clicked")){
                neighbour.classList.add("clicked")
                neighbour.innerText = neighbour.dataset.value;
                extend(hisId)
            }
        }
    }
    
    const gameover = (target) => {
        target.innerText = "";
        h2.innerText = "Game over"
        cells.map((row,t) => {
            row.map((cell,y) => {
                if(cell === "Mine"){
                    const mine = document.getElementById(`${t}${y}`)
                    mine.classList.add("clicked");
                    mine.innerText = "";
                    const img = document.createElement("img");
                    img.src = "download.jpg"
                    mine.appendChild(img)
                }
            })
        })
    }

    const clicking = ({target}) => {
        const value = target.dataset.value
        target.innerText = value;
        target.classList.add("clicked");
        if(value == "Mine"){
            gameover(target);
            game.style.pointerEvents = "none"
        }
        if(!value) extend(target.id)
        //To check if player win
        const clicked = document.querySelectorAll(".clicked")
        if(clicked.length == (rows * cols) - mines){
            h2.innerText = "You win"
            game.style.pointerEvents = "none"
        }
    }

    const boxes = document.querySelectorAll(".box");
    for(let box of boxes){
        box.addEventListener("click", clicking)
        box.addEventListener("contextmenu", (e) => {
            e.preventDefault();
            const {target} = e;
            if(!target.classList.contains("clicked")){
                const num = Number(h1.innerText.split(" ")[2])
                if(!target.innerText && num > 0) {
                    target.innerText = "1";
                    h1.innerText = `Mines : ${num - 1}`
                }
                else if(target.innerText) {
                    target.innerText = "";
                    h1.innerText = `Mines : ${num + 1}`

                }
            }

        })
    }
}
document.querySelector(".easy").addEventListener("click", () => {
    game.style.width = "400px";
    game.style.pointerEvents = "all"
    createGame(5, 8)
})

document.querySelector(".hard").addEventListener("click", () => {
    game.style.width = "800px";
    game.style.pointerEvents = "all"
    createGame(10, 20)
})
createGame(5, 8);