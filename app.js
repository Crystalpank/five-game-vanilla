const fiveGame = (hiddenWord) => {
    const alphabet = [
        ["й", "ц", "у", "к", "е", "н", "г", "ш", "щ", "з", "х", "ъ"],
        ["ф", "ы", "в", "а", "п", "р", "о", "л", "д", "ж", "э"],
        ["Ввод", "я", "ч", "с", "м", "и", "т", "ь", "б", "ю", "<-"]
    ]
    let totalAttempt = 6
    let currentAttempt = 0
    let counterLetter = 0
    let keyButtons = []
    const words = document.getElementById("words")
    const keyboard = document.getElementById("keyboard")
    const modal = document.getElementById("modal")
    let answer = ""

    const validateWord = async (word) => {
        let response = await fetch("https://crystalpank.ru/server.php", {
            method: 'POST',
            body: JSON.stringify({ param: "validateWord", word: word })
        })
        return response.json()
    }

    const createKeyboard = () => {
        alphabet.forEach((letters) => {
            let elRow = document.createElement("div")
            elRow.classList.add("keyboard-row")
            letters.map(letter => {
                let elLetter = document.createElement("div")
                elLetter.classList.add("letter")
                elLetter.textContent = letter
                elRow.append(elLetter)
            })
            keyboard.append(elRow)
        })
    }

    const createFieldGame = () => {
        for (let row = 0; row < 6; row++) {
            let elRow = document.createElement("div")
            elRow.classList.add("answer-word")
            for (let letter = 0; letter < 5; letter++) {
                let elLetter = document.createElement("div")
                elLetter.classList.add("answer-letter")
                elRow.append(elLetter)
            }
            words.append(elRow)
        }
    }

    const checkWord = (letters, keyButtons) => {
        counterLetter = 0
        if (answer === hiddenWord) {
            letters.map(letter => {
                letter.classList.add("hit-letter")
            })
            endGame("win")
        } else if (currentAttempt !== totalAttempt - 1) {
            let firstIndex = 0
            answer.split("").map((letter, index) => {
                if (hiddenWord.at(index) === letter) {
                    keyButtons[index].classList.add("hit-letter")
                    letters[index].classList.add("hit-letter")
                }else if(hiddenWord.includes(letter)){
                    letters[index].classList.add("almostHit-letter")
                    keyButtons[index].classList.add("almostHit-letter")
                }else{
                    keyButtons[index].classList.add("disabled-word")
                }
            })
            keyButtons.length = 0
            answer = ""
            currentAttempt++
        } else {
            endGame("lose")
        }
    }

    const toggleModalWindow = (msg) => {
        modal.querySelector(".modal-title").innerText = msg
        modal.classList.toggle("active")
    }


    const changeWord = (letters) => {
        if (answer.length !== 0) {
            answer.split("").map((letter, index) => {
                letters[index].innerText = letter
            })
        }
    }

    const setLetter = async (e) => {
        let input = e.target.textContent
        let word = words.querySelectorAll(".answer-word")[currentAttempt]
        let letters = Array.from(word.childNodes)
        switch (input) {
            case "<-":
                answer = answer.slice(0, -1)
                letters.map(letter => letter.innerText = "")
                keyButtons.pop(e.target)
                changeWord(letters)
                if (counterLetter > 0) {
                    counterLetter--
                }
                break
            case "Ввод":
                if (counterLetter == 5) {
                    let validate = await validateWord(answer)
                    validate.status ? checkWord(letters, keyButtons) : toggleModalWindow("Такого слова нет!")
                }
                break
            default:
                if (input.length > 1 || counterLetter > 4) return
                answer += input
                keyButtons.push(e.target)
                changeWord(letters)
                counterLetter++
                break


        }
    }
    const endGame = (status) => {
        let div = document.createElement("div")
        div.classList.add("end-game")
        switch (status) {
            case "win":
                div.innerText = "Ты выиграл!"
                break
            case "lose":
                div.innerText = "Попытки закончились, ты проиграл!"
                break
            default:
                return
        }
        keyboard.innerHTML = ""
        keyboard.append(div)
    }
    createKeyboard()
    createFieldGame()

    keyboard.addEventListener("click", setLetter)
    modal.addEventListener("click", () => toggleModalWindow(""))
}

fetch("https://crystalpank.ru/server.php", {
    method: 'POST',
    body: JSON.stringify({ param: "getWord" })
}).then(res => res.json()).then(res => fiveGame(res))

