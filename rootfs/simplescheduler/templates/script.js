// פונקציה לטעינת הסדר המקומי
function loadTableOrder() {
    const orderData = localStorage.getItem('tableOrder');
    if (orderData) {
        const order = JSON.parse(orderData);
        const tbody = $("#dtable tbody");
        tbody.empty(); // נקה את הטבלה הקיימת
        order.forEach(item => {
            if (item.type === 'folder') {
                tbody.append(createFolderRow(item.name)); // צור תיקיה
            } else {
                const row = $(`tr[data-value="${item.id}"]`);
                if (row.length) {
                    tbody.append(row); // הוסף פעולה קיימת
                }
            }
        });
    }
}

// שמירת הסדר המקומי
function saveTableOrder() {
    const order = [];
    $("#dtable tbody").children().each(function () {
        const row = $(this);
        if (row.hasClass('folder-row')) {
            order.push({ type: 'folder', name: row.find('.folder-name').text() });
        } else {
            order.push({ type: 'action', id: row.data('value') });
        }
    });
    localStorage.setItem('tableOrder', JSON.stringify(order));
}

// יצירת שורת תיקיה חדשה
function createFolderRow(name) {
    return $(`
        <tr class="folder-row">
            <td colspan="5" class="bg-secondary text-white">
                <span class="folder-name">${name}</span>
                <button type="button" class="btn btn-danger btn-sm float-end remove-folder">X</button>
            </td>
        </tr>
    `);
}

// הוספת תיקיה חדשה
$(document).on('click', '#add-folder', function () {
    const folderName = prompt("Enter folder name:");
    if (folderName) {
        $("#dtable tbody").append(createFolderRow(folderName));
        saveTableOrder();
    }
});

// הסרת תיקיה
$(document).on('click', '.remove-folder', function () {
    $(this).closest('.folder-row').remove();
    saveTableOrder();
});

// שמירת הסדר בעת שינוי (Drag and Drop)
$("#dtable tbody").sortable({
    distance: 5,
    delay: 100,
    opacity: 0.6,
    cursor: 'move',
    update: saveTableOrder
}).disableSelection();

// טעינת סדר הטבלה עם פתיחת הדף
$(document).ready(function () {
    loadTableOrder();
});
