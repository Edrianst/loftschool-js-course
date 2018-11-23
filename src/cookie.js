/*
 ДЗ 7 - Создать редактор cookie с возможностью фильтрации

 7.1: На странице должна быть таблица со списком имеющихся cookie. Таблица должна иметь следующие столбцы:
   - имя
   - значение
   - удалить (при нажатии на кнопку, выбранная cookie удаляется из браузера и таблицы)

 7.2: На странице должна быть форма для добавления новой cookie. Форма должна содержать следующие поля:
   - имя
   - значение
   - добавить (при нажатии на кнопку, в браузер и таблицу добавляется новая cookie с указанным именем и значением)

 Если добавляется cookie с именем уже существующией cookie, то ее значение в браузере и таблице должно быть обновлено

 7.3: На странице должно быть текстовое поле для фильтрации cookie
 В таблице должны быть только те cookie, в имени или значении которых, хотя бы частично, есть введенное значение
 Если в поле фильтра пусто, то должны выводиться все доступные cookie
 Если дабавляемая cookie не соответсвуте фильтру, то она должна быть добавлена только в браузер, но не в таблицу
 Если добавляется cookie, с именем уже существующией cookie и ее новое значение не соответствует фильтру,
 то ее значение должно быть обновлено в браузере, а из таблицы cookie должна быть удалена

 Запрещено использовать сторонние библиотеки. Разрешено пользоваться только тем, что встроено в браузер
 */

/*
 homeworkContainer - это контейнер для всех ваших домашних заданий
 Если вы создаете новые html-элементы и добавляете их на страницу, то дабавляйте их только в этот контейнер

 Пример:
   const newDiv = document.createElement('div');
   homeworkContainer.appendChild(newDiv);
 */
const homeworkContainer = document.querySelector('#homework-container');
// текстовое поле для фильтрации cookie
const filterNameInput = homeworkContainer.querySelector('#filter-name-input');
// текстовое поле с именем cookie
const addNameInput = homeworkContainer.querySelector('#add-name-input');
// текстовое поле со значением cookie
const addValueInput = homeworkContainer.querySelector('#add-value-input');
// кнопка "добавить cookie"
const addButton = homeworkContainer.querySelector('#add-button');
// таблица со списком cookie
const listTable = homeworkContainer.querySelector('#list-table tbody');

const setCookie = (name, value, expires) => {

    document.cookie = `${name}=${value}; expires=${expires}`;

    addNameInput.value = '';
    addValueInput.value = '';
}

const updateTable = () => {
    listTable.innerHTML = null;
    createTable(parseCookie())
}

const parseCookie = () => {
    const result = document.cookie.split('; ').reduce((prev, current) => {
        const [name, value] = current.split('=');

        prev[name] = value;

        return prev;
    }, {});

    return result;
}

const deleteCookie = (name) => {
    let date = new Date(0);

    setCookie(name, '', date.toUTCString());
}

const isMatching = (full, part) => {
    return full.toLowerCase().indexOf(part.toLowerCase()) !== -1;
}

const createTable = (obj) => {
    for (let keys in obj) {
        const row = document.createElement('tr');

        if (keys) {
            row.innerHTML = '<td>' + keys + '</td>' +
                '<td>' + obj[keys] + '</td>' +
                '<td>' +
                '<button class="btn-delete">Удалить</button>' +
                '</td>';
            listTable.appendChild(row);
            const deleteBtn = row.querySelector('.btn-delete');

            deleteBtn.addEventListener('click', () => {
                deleteCookie(keys);
                listTable.removeChild(row);
            })
        }
    }
}

const createFilteredTable = (props, object) => {
    for (let keys in props) {
        const row = document.createElement('tr');

        row.innerHTML = '<td>' + props[keys] + '</td>' +
            '<td>' + object[props[keys]] + '</td>' +
            '<td>' +
            '<button class="btn-delete">Удалить</button>' +
            '</td>';
        listTable.appendChild(row);

        const deleteBtn = row.querySelector('.btn-delete');

        deleteBtn.addEventListener('click', () => {
            deleteCookie(props[keys]);
            listTable.removeChild(row);
        })
    }
}

filterNameInput.addEventListener('keyup', function () {
    // здесь можно обработать нажатия на клавиши внутри текстового поля для фильтрации cookie
    listTable.innerHTML = null;
    let filterValue = filterNameInput.value;

    const cookies = parseCookie();
    const cookieNames = Object.keys(cookies);
    const namesFilter = cookieNames.filter(el => el && (isMatching(el, filterValue) || isMatching(cookies[el], filterValue)));

    if (filterValue === '') {
        updateTable();
    } else {
        createFilteredTable(namesFilter, cookies);
    }
});

addButton.addEventListener('click', () => {
    // здесь можно обработать нажатие на кнопку "добавить cookie";
    setCookie(addNameInput.value, addValueInput.value);
    updateTable();
})
