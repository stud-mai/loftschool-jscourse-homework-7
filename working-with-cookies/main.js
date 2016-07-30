let cookies = document.cookie,
    form = document.forms[0],
    table = document.createElement('table');

table.id = 'table';

let addTable = () => {
    table.innerHTML = "<table><tr><th>Name</th><th>Value</th><th></th></tr></table>";
    document.body.appendChild(table);
};

let addRow = (name,value) => {
    let newRow = document.createElement('tr'),
        del = '<td><i class="fa fa-trash"></i></td>';

    newRow.innerHTML = `<td>${name}</td><td>${value}</td>` + del;
    table.appendChild(newRow);
};

let remove = (source) => {
    let previous = source.previousElementSibling,
        next = source.nextElementSibling;
    if (next || previous && previous.tagName == 'TR') {
        source.remove();
    } else {
        table.remove();
    }
};

// Show table of cookies if at least one exists
if (cookies){
    addTable();
    cookies.split('; ').forEach(cookie => {
        let parts = cookie.split('=');
        addRow(parts[0],parts[1]);
    });
} else {
    alert('Cookies haven\'t been set');
}

// Handler for clicking on trash can
// Removes the cookie and the row or whole table if only one cookie is left
document.addEventListener('click',(e) => {
    if (e.target.classList.contains('fa-trash')) {
        let row = e.target.parentNode.parentNode,
            key = row.children[0],
            date = new Date(0),
            answer = confirm(`Do you want to remove COOKIE with name "${key.textContent}"?`);

        if(answer){
            document.cookie = `${key.textContent}=; expires=${date.toGMTString()}`;
            remove(row);
        }
    }
});

// Handlers for text fields
form.name.addEventListener('keydown',(e) => {
    if (e.keyCode == 32) e.preventDefault()
});
form.value.addEventListener('keydown',(e) => {
    if (e.keyCode == 32) e.preventDefault()
});
form.days.addEventListener('keydown',(e) => {
    if (!(e.keyCode > 47 && e.keyCode < 58) &&
        !(e.keyCode > 95 && e.keyCode < 106) &&
        e.keyCode != 8 && e.keyCode != 37 && e.keyCode != 39) e.preventDefault()
});

// Handler for "Add cookie" button
// Adds new cookie and row in the table
form.addButton.addEventListener('click', (e) => {
    e.preventDefault();
    let newName = form.name.value,
        newValue = form.value.value,
        newDate = form.days.value,
        currentCookies = document.cookie,
        date = new Date(),
        equal = false,
        partEq = false;
    if (newName && newValue && newDate) {
        //Check if any cookie exists
        if (currentCookies) {
            let tempCookie = currentCookies.split('; ');

            // Check whether new cookie exists
            // or has the same name but different value
            for (let i = 0; i < tempCookie.length; i++){
                let parts = tempCookie[i].split('=');
                if (parts[0] == newName){
                    if (parts[1] == newValue) {
                        equal = true;
                        break;
                    } else {
                        partEq = true;
                        break;
                    }
                }
            }
            if (!equal && !partEq){
                if (newDate) {
                    addRow(newName,newValue);
                }
            } else if (partEq) {
                let rows = table.children;
                for (let i = 1; i < rows.length; i++){
                    if (rows[i].children[0].textContent == newName) {
                        if (newDate) {
                            rows[i].children[1].innerText = newValue;
                            break;
                        } else {
                            remove(rows[i]);
                        }
                    }
                }
            } else if (equal && newDate == '0') {
                let rows = table.children;
                for (let i = 1; i < rows.length; i++){
                    if (rows[i].children[0].textContent == newName) {
                        remove(rows[i]);
                    }
                }
            }
        } else {
            if (newDate) {
                addTable();
                addRow(newName,newValue);
            }
        }

        // Set/remove new cookie
        date.setTime(date.valueOf() + (+newDate * 24 * 3600 * 1000));
        document.cookie = `${newName}=${newValue}; expires=${date.toGMTString()};`;

        // Clear text fields
        form.name.value = form.value.value = form.days.value = '';
    } else {
        alert('Fill in all the form fields!');
    }
});