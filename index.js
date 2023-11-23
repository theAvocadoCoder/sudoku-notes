// Ensure document has loaded before script runs
document.addEventListener("DOMContentLoaded", () => {
    let buttons = document.querySelectorAll(".num");
    let cells = document.querySelectorAll(".cell");
    let pencilToggle = document.querySelector("#pencil-toggle");

    // Active cell is the currently highlighted cell
    let activeCell = null;

    // Pencil mode
    let isPencilMode = true;

    // selected number
    let selectedNum = null;

    // Record the numbers noted in each cell
    let cellsArr= [
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
    ];

    // Select or deselect clicked cells
    cells.forEach(cell => {
        cell.addEventListener('click', (e) => {
            // Cell IDs are in format c# where # is a number 1 - 9
            // Active cell will count from 0, not 1
            // If cell already selected, deselect it
            if (activeCell == Number(e.target.id.split('').pop()) - 1) {
                cell.classList.remove('active-cell');
                activeCell = null;
            } else {
                // Deselect any previously selected cell
                cells.forEach(c=>c.classList.remove('active-cell'));
                // Set and highlight selected cell
                let cellNum = Number(e.target.id.split('').pop());
                cell.classList.add('active-cell');
                activeCell = cellNum - 1;
            }

            e.preventDefault();
        })
    });

    // Put a number in or remove it from a cell
    buttons.forEach(button => {
        button.addEventListener('click', (e) => {
            // Selected number
            let num = Number(e.target.id);
            if (!isPencilMode) {
                selectedNum = num;
                return populateCell();
            }
            // Variable for updating the selected cell
            let cell = cellsArr[activeCell];
            // Clear cell
            if (e.target.id == 'clear') {
                cell.length = 0;
            } else if (activeCell !== null) {
                // Remove number from cell if it exists
                if (cell.includes(num)) {
                    let index = cell.indexOf(num);
                    cell.splice(index, 1);
                } else {
                    // Add new number to cell
                    if (cell.length == 0) {
                        cell.push(num);
                    } else if (cell.length != 8) {
                        // Add new number in ascending order
                        let index = cell.indexOf(cell.filter((n)=>n>num)[0]);
                        index == -1 ? cell.push(num) : cell.splice(index, 0, num);
                    }
                }
            }
            // Update the UI to reflect array data
            return populateCell();
        })
    })

    // Toggle pencil mode on or off
    pencilToggle.addEventListener("click", (e) => {
        e.preventDefault();
        isPencilMode = !isPencilMode;
        e.target.classList.toggle("active-cell");
    })

    // Update the UI to reflect array data
    function populateCell() {
        // Cell must be highlighted to be written to
        if (!activeCell) {
            return;
        }
        
        // Variables to represent the selected cell array and the html element
        let cell = cellsArr[activeCell];
        let uiCell = cells[activeCell];

        // Remove the children so there's a blank slate
        while (true) {
            if (!uiCell.firstChild) {
                break;
            }
            uiCell.removeChild(uiCell.firstChild);
        }

        // TODO: Add functionality for pencil mode
        if (!isPencilMode) {

        }

        // If cell has been cleared, no need to add anything to the element
        if (cell.length == 0) {
            return;
        }

        // Rows of numbers in pencil mode
        let row1 = document.createElement("div");
        row1.classList.add("row", "flex", "justify-center");
        let row2 = document.createElement("div");
        row2.classList.add("row", "flex", "justify-center");
        let row3 = document.createElement("div");
        row3.classList.add("row", "flex", "justify-center");

        // Add a row depending on how many elements are in the cell
        /**
         * The loop starts at the end of the array and prepends the numbers so
         * it can have that pyramid effect. Otherwise, it fills the topmost row first. This way, the bottommost row is always filled first 
         */
        for (let i = cell.length - 1; i >= cell.length - 2 && cell[i]; i--) {
            row3.prepend(document.createTextNode(`${cell[i]}`));
        }
        if (row3.hasChildNodes()) uiCell.prepend(row3);

        for (let i = cell.length - 3; i >= cell.length - 6 && cell[i]; i--) {
            row2.prepend(document.createTextNode(`${cell[i]}`));
        }
        if (row2.hasChildNodes()) uiCell.prepend(row2);

        for (let i = cell.length - 7; i >= cell.length - 8 && cell[i]; i--) {
            row1.prepend(document.createTextNode(`${cell[i]}`));
        }
        if (row1.hasChildNodes()) uiCell.prepend(row1);
    }
})