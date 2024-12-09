// simplescheduler-folders.js
class SchedulerFolders {
    constructor() {
        this.folders = JSON.parse(localStorage.getItem('scheduler_folders')) || [];
        this.currentFolder = null;
        this.initializeUI();
    }

    initializeUI() {
        this.addFolderButton();
        this.renderFolders();
    }

    addFolderButton() {
        const actionContainer = document.querySelector('.titlebar_span').closest('div');
        const folderButton = document.createElement('span');
        folderButton.classList.add('mdi', 'mdi-folder-plus', 'folder-add-btn');
        folderButton.title = 'Add New Folder';
        folderButton.addEventListener('click', () => this.createNewFolder());
        actionContainer.appendChild(folderButton);
    }

    createNewFolder() {
        const folderName = prompt('Enter folder name:');
        if (folderName) {
            const newFolder = {
                id: Date.now(),
                name: folderName,
                items: []
            };
            this.folders.push(newFolder);
            this.saveFolders();
            this.renderFolders();
        }
    }

    renderFolders() {
        const scheduleList = document.querySelector('.content');
        
        // Clear existing folders
        const existingFolders = scheduleList.querySelectorAll('.folder-container');
        existingFolders.forEach(folder => folder.remove());

        // Render folders
        this.folders.forEach(folder => {
            const folderElement = document.createElement('div');
            folderElement.classList.add('folder-container');
            folderElement.dataset.folderId = folder.id;
            
            const folderHeader = document.createElement('div');
            folderHeader.classList.add('folder-header');
            folderHeader.innerHTML = `
                <span class="mdi mdi-folder"></span>
                <span class="folder-name">${folder.name}</span>
                <span class="mdi mdi-arrow-right folder-expand"></span>
            `;

            folderHeader.querySelector('.folder-expand').addEventListener('click', () => this.openFolder(folder.id));
            
            folderElement.appendChild(folderHeader);
            
            // Make folder draggable
            folderElement.setAttribute('draggable', true);
            folderElement.addEventListener('dragstart', (e) => this.handleFolderDragStart(e, folder.id));
            folderElement.addEventListener('dragover', this.handleDragOver);
            folderElement.addEventListener('drop', (e) => this.handleFolderDrop(e, folder.id));

            scheduleList.appendChild(folderElement);
        });

        this.setupDragAndDrop();
    }

    setupDragAndDrop() {
        const schedulerItems = document.querySelectorAll('.row-title');
        schedulerItems.forEach(item => {
            item.setAttribute('draggable', true);
            item.addEventListener('dragstart', this.handleItemDragStart.bind(this));
            item.addEventListener('dragover', this.handleDragOver);
            item.addEventListener('drop', this.handleItemDrop.bind(this));
        });
    }

    handleFolderDragStart(e, folderId) {
        e.dataTransfer.setData('text/plain', `folder:${folderId}`);
    }

    handleItemDragStart(e) {
        const itemName = e.target.textContent;
        e.dataTransfer.setData('text/plain', `item:${itemName}`);
    }

    handleDragOver(e) {
        e.preventDefault();
    }

    handleFolderDrop(e, targetFolderId) {
        e.preventDefault();
        const data = e.dataTransfer.getData('text/plain');
        const [type, value] = data.split(':');

        if (type === 'item') {
            this.moveItemToFolder(value, targetFolderId);
        }
    }

    handleItemDrop(e) {
        e.preventDefault();
        const data = e.dataTransfer.getData('text/plain');
        const [type, value] = data.split(':');

        if (type === 'folder') {
            // Handle moving a folder (optional)
        }
    }

    moveItemToFolder(itemName, folderId) {
        const targetFolder = this.folders.find(f => f.id == folderId);
        if (targetFolder && !targetFolder.items.includes(itemName)) {
            targetFolder.items.push(itemName);
            this.saveFolders();
            this.renderFolders();
        }
    }

    openFolder(folderId) {
        const folder = this.folders.find(f => f.id == folderId);
        if (folder) {
            this.currentFolder = folder;
            this.filterSchedulerItems(folder.items);
        }
    }

    filterSchedulerItems(folderItems) {
        const schedulerItems = document.querySelectorAll('.row-title');
        schedulerItems.forEach(item => {
            const itemName = item.textContent;
            item.style.display = folderItems.includes(itemName) ? 'block' : 'none';
        });
    }

    saveFolders() {
        localStorage.setItem('scheduler_folders', JSON.stringify(this.folders));
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    new SchedulerFolders();
});
