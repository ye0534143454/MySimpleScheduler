$(document).ready(function () {
    let $tbody = $("#dtable tbody");

    function makeItemsSortable() {
        $tbody.sortable({
            distance: 5,
            delay: 100,
            opacity: 0.6,
            cursor: 'move',
            connectWith: "tr.folder",
            update: function (e, tr) {
                let orderlist = '';
                $('tr.ui-sortable-handle').each(function (i) {
                    $(this).attr('data-order', i);
                    orderlist = orderlist + '&list[' + i + ']=' + $(this).attr('data-value');
                });
                $("#sidebar-wrapper").load("sort?" + orderlist);
            }
        }).disableSelection();

        $("tr.folder").droppable({
            accept: "tr.ui-sortable-handle",
            drop: function (event, ui) {
                ui.draggable.appendTo($(this).next("tbody"));
            }
        });

        $tbody.find('tr[data-folder-id]').each(function () {
            let folderId = $(this).attr('data-folder-id');
            $(this).appendTo($("tr.folder[data-folder-id='" + folderId + "']").next("tbody"));
        });
    }

    makeItemsSortable();

    // Event listener to add new folder
    $("#add-folder-btn").on("click", function () {
        let folderName = $("#new-folder-name").val().trim();
        if (folderName) {
            let folderId = "folder" + (new Date().getTime()); // Unique ID
            let newFolderHtml = `<tr class="folder" data-folder-id="${folderId}">
                                    <td colspan="5">${folderName}</td>
                                 </tr>`;

            $tbody.append(newFolderHtml);
            makeItemsSortable(); // re-apply sortable and droppable
            $("#new-folder-name").val(""); // Clear input
        }
    });
});

function toggle_sidebar() {
    $("#sidebar").hide();
    $("body").css('overflow', 'auto');
}