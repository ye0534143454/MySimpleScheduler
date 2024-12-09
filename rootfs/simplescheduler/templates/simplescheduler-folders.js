// simplescheduler-folders.js
document.addEventListener('DOMContentLoaded', function() {
    class SchedulerFolders {
        constructor() {
            this.folders = JSON.parse(localStorage.getItem('scheduler_folders')) || [];
            this.initializeUI();
        }

        initializeUI() {
            this.addFolderButton();
            this.setupFolderFunctionality();
        }

        addFolderButton() {
            // Find the div with the existing icons
            const actionContainer = document.querySelector('.titlebar_span').closest('div');
            
            // Create folder button next to existing icons
            const folderButton = document.createElement('span');
            folderButton.classList.add('mdi', 'mdi-folder-plus');
            folderButton.style.marginLeft = '10px';
            folderButton.style.cursor = 'pointer';
            folderButton.title = 'Add New Folder';
            
            folderButton.addEventListener('click', () => this.createNewFolder());
            
            // Insert the button in the correct location
            actionContainer.appendChild(folderButton);
        }

        createNewFolder() {
            const folderName = prompt('Enter folder name:');
            if (folderName && folderName.trim() !== '') {
                const newFolder = {
                    id: Date.now(),
                    name: folderName.trim(),
                    items: []
                };
                
                this.folders.push(newFolder);
                this.saveFolders();
                this.renderFolders();
            }
        }

        setupFolderFunctionality() {
            // Make schedules draggable
            const schedules = document.querySelectorAll('.row-title');
            schedules.forEach(schedule => {
                schedule.setAttribute('draggable', 'true');
                
                schedule.addEventListener('dragstart', (e) => {
                    e.dataTransfer.setData('text/plain', schedule.textContent);
                });
            });

            this.renderFolders();
        }

        renderFolders() {
            // Remove existing folder elements
            const existingFolders = document.querySelectorAll('.folder-item');
            existingFolders.forEach(folder => folder.remove());

            // Find the content wrapper
            const contentWrapper = document.querySelector('.content');

            // Render folders
            this.folders.forEach(folder => {
                const folderElement = document.createElement('div');
                folderElement.classList.add('folder-item');
                folderElement.innerHTML = `
                    <span class="mdi mdi-folder"></span>
                    <span>${folder.name}</span>
                `;

                // Add drop functionality
                folderElement.addEventListener('dragover', (e) => {
                    e.preventDefault();
                });

                folderElement.addEventListener('drop', (e) => {
                    e.preventDefault();
                    const scheduleName = e.dataTransfer.getData('text/plain');
                    
                    // Check if item already in folder
                    if (!folder.items.includes(scheduleName)) {
                        folder.items.push(scheduleName);
                        this.saveFolders();
                        this.renderFolders();
                    }
                });

                contentWrapper.appendChild(folderElement);
            });
        }

        saveFolders() {
            localStorage.setItem('scheduler_folders', JSON.stringify(this.folders));
        }
    }

    // Initialize folders
    new SchedulerFolders();
});
