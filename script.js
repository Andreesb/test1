document.addEventListener('DOMContentLoaded', () => {
    const leftJoystick = document.querySelector('.left-joystick');
    const rightJoystick = document.querySelector('.right-joystick');
    const audioElement = document.getElementById('background-music');
    const startButton = document.querySelector('.control-button.start');
    const pauseButton = document.querySelector('.control-button.pause');
    const options = document.querySelectorAll('.menu-option');
    const menuContainer = document.getElementById('menu-container');
    const yButton = document.querySelector('.control-button.Y');
    const aButton = document.querySelector('.control-button.A');
    const xButton = document.querySelector('.control-button.X');
    const volumeProgress = document.getElementById('volume-progress');
    const plusButton = document.querySelector('.volume-control.plus');
    const minusButton = document.querySelector('.volume-control.minus');
    const images = document.querySelectorAll('.carousel-image');
    const certificateImage = document.querySelector('.carousel-image.certificado');
    const folders = document.querySelectorAll('.project-folders .folder');
    const projectSection = document.getElementById('content-projects');
    const cards = document.querySelectorAll('.card');
    const cardContainer = document.querySelector('.card-container');
    const leftTexts = document.querySelectorAll('.left-text');
    const centerTexts = document.querySelectorAll('.center-text');
    const rightTexts = document.querySelectorAll('.right-text');
    let contactItems = document.querySelectorAll(".contact-item");
    let contactInfos = document.querySelectorAll(".contact-info");
    let emailOptions = document.querySelectorAll('.email-options li a');


    const backgrounds = [
        '',
        'media/nintendo/os/resume/tarjetaImage1.gif',
        'media/nintendo/os/resume/tarjetaImage2.gif',
        'media/nintendo/os/resume/tarjetaImage3.gif',
        'media/nintendo/os/resume/tarjetaImage4.gif',
        'media/nintendo/os/resume/tarjetaImageBase.jpg',
    ];


    
    const minVolume = 0;
    const maxVolume = 100;
    let currentVolume = 80;
    let selectedFolderIndex = 0;
    let currentIndex = 0;
    let certificateIndex = 0;
    let cardIndex = 0;
    let selectedOptionIndex = 0;
    let joystickMoveDelay = 150;
    let lastMoveTime = 0;
    let MenuVisible = false;
    let IndexContactList = 0;
    let IndexEmailOptions = 0;
    let isNavigating = false;
    const navigationDelay = 125;
    
    function changeImage(button, isPressing) {
        const nintendoImage = document.querySelector('.nintendo-image');
        let buttonImage;

        switch (button) {
            case 'up': buttonImage = 'media/nintendo/up.png'; break;
            case 'left': buttonImage = 'media/nintendo/left.png'; break;
            case 'right': buttonImage = 'media/nintendo/right.png'; break;
            case 'down': buttonImage = 'media/nintendo/down.png'; break;
            case 'X': buttonImage = 'media/nintendo/X.png'; break;
            case 'Y': buttonImage = 'media/nintendo/Y.png'; break;
            case 'A': buttonImage = 'media/nintendo/A.png'; break;
            case 'B': buttonImage = 'media/nintendo/B.png'; break;
            case 'start': buttonImage = 'media/nintendo/start.png'; break;
            case 'pause': buttonImage = 'media/nintendo/pause.png'; break;
            case 'volume-up': buttonImage = 'media/nintendo/plus.png'; break;
            case 'volume-down': buttonImage = 'media/nintendo/minus.png'; break;
            default: buttonImage = 'media/nintendo/nintendoNUEVO.png';
        }

        if (isPressing) {
            nintendoImage.src = buttonImage;
        } else {
            nintendoImage.src = 'media/nintendo/nintendoNUEVO.png';
        }
    }

    function changeVolume(action) {
        let currentVolume = audioElement.volume;
        
        const volumeBar = document.querySelector('.volume-bar');
        const muteImage = document.querySelector('.mute-image');

        if (action === 'up' && currentVolume < 1) {
            audioElement.volume = Math.min(1, currentVolume + 0.2);
        } else if (action === 'down' && currentVolume > 0) {
            audioElement.volume = Math.max(0, currentVolume - 0.2);
        }

        volumeProgress.style.width = `${audioElement.volume * 100}%`;
        volumeBar.style.display = 'block';

        // Mostrar imagen de mute si el volumen es 0
        if (audioElement.volume === 0) {
            muteImage.style.display = 'block';
        } else {
            muteImage.style.display = 'none';
        }

        clearTimeout(volumeBar.hideTimeout);
        volumeBar.hideTimeout = setTimeout(() => {
            volumeBar.style.display = 'none';
        }, 2000);
    }

    function updateNintendoTime() {
        const timeElement = document.getElementById('nintendo-time');
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        timeElement.textContent = `${hours}:${minutes}`;
    }

    setInterval(updateNintendoTime, 500);

    function updateSignalIcon(ping) {
        const bars = document.querySelectorAll('.bar');
        let level = 0;
    
        if (ping < 1400) {
            level = 3;
        } else if (ping < 2450) {
            level = 2;
        } else {
            level = 1;
        }
    
        bars.forEach((bar, index) => {
            if (index < level) {
                bar.style.height = (index + 0.3) * 0.5 + 'vh'; // Ajuste de altura para las barras activas
                bar.classList.remove('low', 'medium');
                if (level == 1) {
                    bar.classList.add('low');
                } else if (level == 2) {
                    bar.classList.add('medium');
                }
            } else {
                bar.style.height = '1vh'; // Altura más pequeña para las barras no activas
                bar.style.width = '1vw';
                bar.classList.remove('low', 'medium');
            }
        });
    }
    
    
    function measurePing() {
        const start = Date.now();
        fetch('https://www.google.com', { mode: 'no-cors' })
            .then(() => {
                const ping = Date.now() - start;
                updateSignalIcon(ping);
            })
            .catch(() => {
                updateSignalIcon(1000); // Set to maximum ping on failure
            });
    }
    
    setInterval(measurePing, 500);


    function showMenu() {
        MenuVisible = true;
        hideAllContent();
        
        menuContainer.classList.add('show');
        menuContainer.classList.remove('hide');

        console.log("se abrió el menú");
    }

    function hideMenu() {
        MenuVisible = false;
        menuContainer.classList.add('hide');
        menuContainer.classList.remove('show');
        console.log("se cerró el menú");
    }

    // Función para ocultar contenido de las opciones
    function showContent(sectionClass) {
        hideMenu();
        hideAllContent(); // Primero oculta todas las secciones

    const contentElement = document.querySelector(`.${sectionClass}`);
    if (contentElement) {
        contentElement.classList.remove('hide');
        contentElement.classList.add('show');
        console.log(`mostrando el contenido de la seccion: .${sectionClass}`);
    } else {
        console.error(`No se encontró el contenido con la clase: ${sectionClass}`);
        }
    }

    // Oculta una sección específica
    function hideContent(sectionClass) {
        const contentElement = document.querySelector(`.${sectionClass}`);
        if (contentElement) {
            contentElement.classList.remove('show');
            contentElement.classList.add('hide');
        } else {
            console.error(`No se encontró el contenido con la clase: ${sectionClass}`);
        }
    }


    function hideAllContent() {
        const contentSections = document.querySelectorAll('.content'); // Selector de contenido
        contentSections.forEach(section => {
            section.classList.remove('show');
            section.classList.add('hide');
        });
    }

    function updateSelectedOption(index) {
        selectedOptionIndex = index;
        options.forEach(option => option.classList.remove('selected'));
        options[selectedOptionIndex].classList.add('selected');
    }

    function navigateFolders(direction) {
        if (direction === 'up') {
            selectedFolderIndex = (selectedFolderIndex - 1 + folders.length) % folders.length;
        } else if (direction === 'down') {
            selectedFolderIndex = (selectedFolderIndex + 1) % folders.length;
        }
        updateSelectedFolder(selectedFolderIndex);
    }


    function updateSelectedFolder(index) {
        folders.forEach(folder => folder.classList.remove('selected'));
        folders[index].classList.add('selected');
    }

    function openFolder(index) {
        toggleFolder(index + 1);
        console.log("Se abrio una carpeta de proyecto")
    }

    function closeCurrentProjectContent() {
        const currentFolderContents = document.querySelectorAll('.project-content.show');
        currentFolderContents.forEach(content => {
            content.classList.remove('show');
            
        // Si deseas mantener algún estilo o animación al ocultar, puedes hacerlo aquí
        });

    }


    function toggleFolder(index) {
        if (isContentVisible('option1')) {
            const contents = document.querySelectorAll('.project-content');
            contents.forEach(content => {
                content.classList.add('hide');
                content.classList.remove('show');
            });
        
            const selectedContent = document.querySelector(`#project-content-${index}`);
            if (selectedContent) {
                selectedContent.classList.remove('hide');
                selectedContent.classList.add('show');
            }
        }
    }


    function updateTextVisibility(textElements, cardIndex) {
    textElements.forEach(text => {
        text.style.display = text.dataset.index == cardIndex ? 'block' : 'none';
    });
    }

    function updateCards() {
        if (isContentVisible('option2')) {
            cards.forEach((card, index) => {
                card.classList.remove('active', 'prev', 'next', 'inactive');

                if (index === cardIndex) {
                    card.classList.add('active');
                } else if (index === (cardIndex - 1 + cards.length) % cards.length) {
                    card.classList.add('prev');
                } else if (index === (cardIndex + 1) % cards.length) {
                    card.classList.add('next');
                } else {
                    card.classList.add('inactive');
                }
            });

            cardContainer.style.backgroundImage = `url(${backgrounds[cardIndex]})`;

            updateTextVisibility(leftTexts, cardIndex);
            updateTextVisibility(centerTexts, cardIndex);
            updateTextVisibility(rightTexts, cardIndex);
        }
    }

    function navigateCards(direction) {
        if (cards.length > 0) {
            if (direction === 'down') {
                cardIndex = (cardIndex + 1) % cards.length;
            } else if (direction === 'up') {
                cardIndex = (cardIndex - 1 + cards.length) % cards.length;
            }
            updateCards();
        }
    }

    cards.forEach(function(card) {
        var index = card.getAttribute('data-index');
        card.classList.add('color-' + index);
    });

    
    let isCertificateOpen = false;  // Variable para verificar si un certificado está abierto

    function updateCarousel() {
        const carousel = document.querySelector('.carousel');
        let images = Array.from(document.querySelectorAll('.carousel-image'));
        const certificateImage = document.querySelector('.carousel-image.certificado');

        if (!carousel || !images.length) return;

        // Filtrar las imágenes para excluir la que tiene la clase 'certificado'
        images = images.filter(img => !img.classList.contains('certificado'));

        // Calcular el desplazamiento necesario para centrar la imagen actual
        const selectedImage = images[certificateIndex];
        const carouselRect = carousel.getBoundingClientRect();
        const imageRect = selectedImage.getBoundingClientRect();

        // Calcular el centro del carrusel y la imagen seleccionada
        const carouselCenter = carouselRect.left + carouselRect.width / 2;
        const imageCenter = imageRect.left + imageRect.width / 2;

        // Calcular el desplazamiento necesario para centrar la imagen
        const scrollPosition = imageCenter - carouselCenter;

        // Mantener la imagen del certificado centrada
        if (certificateImage) {
            const certRect = certificateImage.getBoundingClientRect();
            const certCenter = certRect.left + certRect.width / 2;
            const certScrollPosition = certCenter - carouselCenter;

            // Ajustar el desplazamiento del carrusel para mantener la imagen del certificado centrada
            carousel.scrollLeft += certScrollPosition - scrollPosition;
        }

        // Actualizar las clases de las imágenes para indicar la seleccionada
        images.forEach((img, index) => {
            img.classList.remove('selected');
            if (index === currentIndex) {
                img.classList.add('selected');
            }
        });
    }


    function navigateCarouselLeft() {
        const images = document.querySelectorAll('.carousel-image');
        if (currentIndex > 0) {
            currentIndex--;
        } else {
            currentIndex = images.length - 1;
        }
        updateCarousel();
    }
    
    function navigateCarouselRight() {
        const images = document.querySelectorAll('.carousel-image');
        if (currentIndex < images.length - 1) {
            currentIndex++;
        } else {
            currentIndex = 0;
        }
        updateCarousel();
    }

    document.addEventListener('keydown', function(event) {
        if (isContentVisible('option3')) {
            if (event.key === 'ArrowLeft') {
                navigateCarouselLeft();
            } else if (event.key === 'ArrowRight') {
                navigateCarouselRight();
            }
        }
    });

    function openCertificate(index) {
        if (isContentVisible('option3')) {
            hideImageContent();
            const sectionId = `content-section-${index}`;
            const content = document.getElementById(sectionId);
            if (content) {
                content.classList.add('show');
                content.classList.remove('hide');
                console.log("Se abrió una imagen del carrusel");
            }
        }
    }

    function hideImageContent() {
        const selectedImageContent = document.querySelector('.carousel .show');
        if (selectedImageContent) {
            selectedImageContent.classList.remove('show');
            selectedImageContent.classList.add('hide');
        }
        
    }

    // Manejar clic en las imágenes del carrusel
    document.querySelectorAll('.carousel-image').forEach((img, index) => {
        img.addEventListener('click', () => {
            currentIndex = index;
            openCertificate(index);
            isCertificateOpen = true;  // Marcar que se ha abierto un certificado
            updateCarousel();
        });
    });

    
    function selectOption() {
        if (MenuVisible) {
            const activeOption = options[selectedOptionIndex];
            const action = activeOption.getAttribute('data-action');
                const sectionId = activeOption.getAttribute('data-section');
                showContent(sectionId);
        }
    }

    // Function to handle go back
    function goBack() {
        const folderContentVisible = projectSection && Array.from(projectSection.querySelectorAll('.project-content')).some(content => content.classList.contains('show'));
        const carouselContentVisible = Array.from(images).some(img => img.classList.contains('show'));
        const MenuVisible = menuContainer.classList.contains('show');
        const testProjects = isContentVisible('option1');
        const testResume = isContentVisible('option2');
        const testCertificates = isContentVisible('option3');
        const testReport = isContentVisible('option4');
        const testContact = isContentVisible('option5');
        const isReportFormVisible = document.querySelector('#form-reports').classList.contains('show');
        const isSuggestFormVisible = document.querySelector('#form-suggests').classList.contains('show');


        if (testProjects && !folderContentVisible) {
            hideContent("option1");
            hideAllContent();
            showMenu();
            console.log("se cerro la seccion de proyectos")
            updateSelectedFolder(0);
        } else if (folderContentVisible) {
            closeCurrentProjectContent();
            projectSection.classList.add('show');
            console.log("se cerro la carpeta de proyectos")
        } else if (testResume) {
            hideContent("option2");
            hideAllContent();
            showMenu();
            console.log("se cerro la seccion de resume")
            currentIndex = 0
        } else if (testCertificates) {
            if (carouselContentVisible) {
                hideImageContent();
                console.log("se cerro el certificado")
                updateCarousel();
                isCertificateOpen = false;
            } else {
            hideContent("option3");
            hideAllContent();
            showMenu();
            console.log("se cerro la seccion de certificado")
            currentIndex = 0
            }
        }  else if (MenuVisible) {
            hideMenu();
            console.log("se cerro el menu")
            updateSelectedOption(0)
        } else if (testReport) {
            if (isReportFormVisible || isSuggestFormVisible) {
                closeForm();
                console.log("se cerro el formulario")
            } else if (!confirmationDialog.classList.contains('hide')){
                hideConfirmationMessage();
            } else {
            hideContent('option4');
            console.log("se cerro la seccion de report")
            hideAllContent();
            showMenu();
            
            }
        } else if (testContact) {
            hideContent('option5');
            console.log("se cerro la lista de contacto")
            hideAllContent();
            contactItems.forEach((item) => {
                item.classList.remove("active");
                console.log('se quito la condicion de active')
            });
            updateActiveContact(0);
            showMenu();

        } else {
            return
        }
    }
    
    
    function openContentSection(sectionId) {
        hideAllContent(); // Asegúrate de ocultar todos los contenidos antes de mostrar el nuevo
        const content = document.getElementById(sectionId);
        if (content) {
            content.classList.remove('hide');
            content.classList.add('show');
        } else {
            console.error(`No se encontró el contenido con el id: ${sectionId}`);
        }
    }

    images.forEach((img) => {
        img.addEventListener('click', () => {
            const sectionId = img.dataset.section;
            openContentSection(sectionId);
        });
    });

    function updateActiveEmailOption(index) {
        emailOptions.forEach((item, i) => {
            item.classList.toggle("active-email", i === index); // Clase CSS para el estado activo
        });
    }
    
    function showEmailOptions() {
        // Asegura que las opciones de correos estén visibles y la primera esté seleccionada
        emailOptions = document.querySelectorAll('.email-options li a'); // Actualiza la referencia en caso de cambios dinámicos
        IndexEmailOptions = 0;
        updateActiveEmailOption(IndexEmailOptions);
    }
    
    function openEmailLink(index) {
        if (emailOptions.length > 0) {
            const url = emailOptions[index].href;
            window.open(url, '_blank', 'noopener'); // Abre en una nueva pestaña
            console.log('Se abrió el enlace de correo en una nueva pestaña');
        }
    }
    
    document.addEventListener("keydown", function(event) {
        if (isContentVisible('option5') && contactInfos[0].classList.contains('expanded')) {
            switch(event.key) {
                case "ArrowLeft":
                    IndexEmailOptions = (IndexEmailOptions > 0) ? IndexEmailOptions - 1 : IndexEmailOptions;
                    updateActiveEmailOption(IndexEmailOptions);
                    break;
                case "ArrowRight":
                    IndexEmailOptions = (IndexEmailOptions < emailOptions.length - 1) ? IndexEmailOptions + 1 : IndexEmailOptions;
                    updateActiveEmailOption(IndexEmailOptions);
                    break;
                case "Enter":
                    openEmailLink(IndexEmailOptions);
                    break;
            }
        }
    });
    
    // Detecta cuando la opción 1 (Mails) está seleccionada y muestra las opciones de correo
    function updateActiveContact(index) {
        if (isContentVisible('option5')) {
            contactItems.forEach((item, i) => {
                item.classList.toggle("active", i === index);
                contactInfos[i].classList.toggle("expanded", i === index);
    
                // Si la opción 1 está seleccionada, muestra las opciones de correo
                if (i === 0 && i === index && contactInfos[i].classList.contains('expanded')) {
                    showEmailOptions(); // Llama a la función para mostrar las opciones de correos
                }
            });
        }
    }


    function openContactLink(index) {
        if (isContentVisible('option5')) {
            const activeContact = contactItems[index];

            if (activeContact.classList.contains("active")) {
                const url = activeContact.getAttribute('data-url');
                if (url) {
                    window.open(url, '_blank', 'noopener');
                    console.log("Se abrió el link de la lista de opciones de contacto");
                }
            } else if (!activeContact.classList.contains("active")) {
                console.log("Debe seleccionar un contacto antes de abrir el enlace");
                return
            }
        }
    }

    function startMovingJoystick(joystick, event) {
        joystick.setPointerCapture(event.pointerId);
        const rect = joystick.getBoundingClientRect();
        const startX = rect.left + rect.width / 2;
        const startY = rect.top + rect.height / 2;
        const maxRadius = 15;

        function moveJoystick(e) {
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;
            const distance = Math.sqrt(dx * dx + dy * dy);

            let limitedX = dx;
            let limitedY = dy;

            if (distance > maxRadius) {
                const angle = Math.atan2(dy, dx);
                limitedX = Math.cos(angle) * maxRadius;
                limitedY = Math.sin(angle) * maxRadius;
            }

            joystick.style.transform = `translate(${limitedX}px, ${limitedY}px) translate(-50%, -50%)`;
            joystick.style.boxShadow = `${-limitedX / 5}px ${-limitedY / 5}px 10px rgba(0, 0, 0, 0.5)`;


            if (Math.abs(limitedX) > Math.abs(limitedY)) {
                if (limitedX > 5) {
                    handleNavigation('right');
                } else if (limitedX < -5) {
                    handleNavigation('left');
                }
            } else {
                if (limitedY > 5) {
                    handleNavigation('down');
                } else if (limitedY < -5) {
                    handleNavigation('up');
                }
            }
        }

        function stopJoystick() {
            joystick.removeEventListener('pointermove', moveJoystick);
            joystick.removeEventListener('pointerup', stopJoystick);
            joystick.style.transform = 'translate(-50%, -50%)';
            joystick.style.boxShadow = 'inset 0 0 100px rgba(77, 76, 76, 0.5)';
        }

        joystick.addEventListener('pointermove', moveJoystick);
        joystick.addEventListener('pointerup', stopJoystick);
    }


    function isContentVisible(sectionClass) {
        const contentElement = document.querySelector(`.${sectionClass}`);
        
        // Verifica si el elemento existe antes de continuar
        if (!contentElement) {
            console.error(`No se encontró ningún elemento con la clase: ${sectionClass}`);
            return false;
        }
    

        const isVisible = contentElement.classList.contains('show');
        
        return isVisible;
    }
    



    function handleNavigation(direction) {
        const now = Date.now();
        if (now - lastMoveTime < joystickMoveDelay) return;
    
        const projectsVisible = isContentVisible('option1');
        const resumeVisible = isContentVisible('option2');
        const carouselVisible = isContentVisible('option3');
        const contactListVisible = isContentVisible('option5');
        const reportsVisible = isContentVisible('option4');
        const isReportFormVisible = document.querySelector('#form-reports').classList.contains('show');
        const isSuggestFormVisible = document.querySelector('#form-suggests').classList.contains('show');
        const settingsVisible = isContentVisible('option6');
        const editUserVisible = document.getElementById('edit-user-modal').classList.contains('show');
        const menuVisible = menuContainer.classList.contains('show');
    
        const navigationHandlers = {
            menu: {
                up: () => selectedOptionIndex = (selectedOptionIndex - 3 + options.length) % options.length,
                down: () => selectedOptionIndex = (selectedOptionIndex + 3) % options.length,
                left: () => selectedOptionIndex = (selectedOptionIndex - 1 + options.length) % options.length,
                right: () => selectedOptionIndex = (selectedOptionIndex + 1) % options.length,
                update: () => updateSelectedOption(selectedOptionIndex)
            },
            carousel: {
                left: () => {
                    const images = Array.from(document.querySelectorAll('.carousel-image')).filter(img => !img.classList.contains('certificado'));
                    currentIndex = (currentIndex > 0) ? currentIndex - 1 : images.length - 1;
                },
                right: () => {
                    const images = Array.from(document.querySelectorAll('.carousel-image')).filter(img => !img.classList.contains('certificado'));
                    currentIndex = (currentIndex < images.length - 1) ? currentIndex + 1 : 0;
                },
                update: () => updateCarousel()
            },
            contactList: {
                up: () => IndexContactList = (IndexContactList > 0) ? IndexContactList - 1 : IndexContactList,
                down: () => IndexContactList = (IndexContactList < contactItems.length - 1) ? IndexContactList + 1 : IndexContactList,
                update: () => updateActiveContact(IndexContactList)
            },
            reportMenu: {
                left: () => navigateMenu(direction),
                right: () => navigateMenu(direction),
                update: () => selectMenuButton(selectedButtonIndex)
            },
            forms: {
                navigate: () => navigateFormFields(direction, isReportFormVisible ? reportForm : suggestForm),
                update: () => selectFormField(index, form)
            },
            projectContent: {
                up: () => selectedFolderIndex = (selectedFolderIndex - 1 + folders.length) % folders.length,
                down: () => selectedFolderIndex = (selectedFolderIndex + 1) % folders.length,
                update: () => updateSelectedFolder(selectedFolderIndex)
            },
            cards: {
                up: () => navigateCards(direction),
                down: () => navigateCards(direction),
                update: () => updateCards()
            },
            settings: {
                up: () => currentIndex = (currentIndex > 0) ? currentIndex - 1 : settingsOption.length - 1,
                down: () => currentIndex = (currentIndex < settingsOption.length - 1) ? currentIndex + 1 : 0,
                update: () => updateActiveOption(currentIndex)
            },
            editUser: {
                left: () => handleAvatarNavigation({ key: 'ArrowLeft' }),
                right: () => handleAvatarNavigation({ key: 'ArrowRight' }),
                up: () => handleAvatarNavigation({ key: 'ArrowUp' }),
                down: () => handleAvatarNavigation({ key: 'ArrowDown' }),
                select: () => handleAvatarNavigation({ key: 'Enter' })
            }
        };
    
        const context = [
            { check: menuVisible, handler: navigationHandlers.menu },
            { check: carouselVisible, handler: navigationHandlers.carousel },
            { check: contactListVisible, handler: navigationHandlers.contactList },
            { check: reportsVisible, handler: navigationHandlers.reportMenu },
            { check: isReportFormVisible || isSuggestFormVisible, handler: navigationHandlers.forms },
            { check: projectsVisible, handler: navigationHandlers.projectContent },
            { check: resumeVisible, handler: navigationHandlers.cards },
            { check: settingsVisible, handler: navigationHandlers.settings },
            { check: editUserVisible, handler: navigationHandlers.editUser }
        ];
    
        for (const { check, handler } of context) {
            if (check) {
                if (handler[direction]) {
                    handler[direction]();
                }
                if (handler.update) {
                    handler.update();
                }
                break;
            }
        }
    
        lastMoveTime = now;
    }
    
    

    // Evento para manejar la navegación y selección con el teclado
    document.addEventListener('keydown', (event) => {
        const MenuVisible = menuContainer.classList.contains('show');
        const isCarouselVisible = isContentVisible('option3');
        const isProjectVisible = isContentVisible('option1')
    
        if (event.key === 'Enter') {
            if (MenuVisible) {
                selectOption();
            } else if (isCarouselVisible) {
                openCertificate(currentIndex);
                console.log('enter, keydown ');
            } else if (isProjectVisible) {
                openFolder(selectedFolderIndex);
            }
        } else if (event.key === 'Escape') {
            goBack();
        } else if (event.key.startsWith('Arrow')) {
            const direction = event.key.replace('Arrow', '').toLowerCase();
            if (MenuVisible) {
                handleNavigation(direction);
            } else if (isProjectVisible) {
                navigateFolders(direction);
            }
        }
    });

    document.addEventListener('keydown', function(event) {
        if (isContentVisible('option2')){
            if (event.key === 'ArrowDown') {
                navigateCards('down');
                console.log('abajo');
            } else if (event.key === 'ArrowUp') {
                navigateCards('up');
                console.log('arriba');
            }
            }
        });



    document.addEventListener("keydown", function(event) {
        if (isContentVisible('option5')) {
            switch(event.key) {
                case "ArrowUp":
                    IndexContactList = (IndexContactList > 0) ? IndexContactList - 1 : IndexContactList;
                    updateActiveContact(IndexContactList);
                    break;
                case "ArrowDown":
                    IndexContactList = (IndexContactList < contactItems.length - 1) ? IndexContactList + 1 : IndexContactList;
                    updateActiveContact(IndexContactList);
                    break;
                case "Enter":
                    openContactLink(IndexContactList);
                    console.log('se selecciono la opcion de contacto con enter')
                    break;
            }
        }
    });
    
    
    aButton.addEventListener('click', () => {
        const activeIndex = Array.from(contactItems).findIndex(item => item.classList.contains('active'));
        if (isContentVisible('option5')) {
            if (activeIndex !== -1) {
                openContactLink(IndexContactList);
                console.log('se selecciono la opcion de contacto con la a')

            }
        } else {
            console.log('no esta la lista de contact')
        }
    });

    

    document.addEventListener('click', (event) => {
        const MenuVisible = menuContainer.classList.contains('show');
        if (MenuVisible) {
            const target = event.target.closest('.menu-option');
            if (target) {
                const index = Array.from(options).indexOf(target);
                if (index !== -1) {
                    updateSelectedOption(index);
                    selectOption();
                }
            }
        }
    });

    



    // Ajustar eventos de los botones del control
    document.querySelectorAll('.control-button').forEach(button => {
        button.addEventListener('pointerdown', (event) => {
            const buttonClass = button.classList[1];
            changeImage(buttonClass, true);
            if (['up', 'down', 'left', 'right'].includes(buttonClass)) {
                handleNavigation(buttonClass);

            } else if (buttonClass === 'A') {
                if (MenuVisible){
                selectOption();
                } else if (isContentVisible('option1')) {
                openFolder(selectedFolderIndex);
                } else if (isContentVisible('option3')) {
                showImageContent(currentIndex);
                } else if (isContentVisible('option4')) {
                    if (reportMenu.style.display == 'flex'){
                        openForm(menuButtons[selectedButtonIndex].getAttribute('data-form'));
                    } else if (!confirmationDialog.classList.contains('hide')) {
                        if (document.activeElement === confirmButton) {
                            hideConfirmationMessage();
                            showSuccessMessage();
                            if (activeForm) {
                                clearFormFields(activeForm);
                            }}
                        } else if (document.activeElement === backButton) {
                            hideConfirmationMessage();
                        }
                    }
                
            } else if (buttonClass === 'Y') {
                goBack();
            } else if (buttonClass === 'plus' || buttonClass === 'minus') {
                changeVolume(buttonClass === 'plus' ? 'up' : 'down');
            }
        });
        button.addEventListener('pointerup', (event) => {
            changeImage(button.classList[1], false);
        });
        button.addEventListener('pointerleave', (event) => {
            changeImage(button.classList[1], false);
        });
    });

    startButton.addEventListener('pointerdown', showMenu);
    pauseButton.addEventListener('pointerdown', hideMenu);

    leftJoystick.addEventListener('pointerdown', (event) => startMovingJoystick(leftJoystick, event));
    rightJoystick.addEventListener('pointerdown', (event) => startMovingJoystick(rightJoystick, event));

    

    plusButton.addEventListener('click', () => {
        changeImage('volume-up', true);
        changeVolume('up');
        setTimeout(() => changeImage('volume-up', false), 100);
    });
    
    minusButton.addEventListener('click', () => {
        changeImage('volume-down', true);
        changeVolume('down');
        setTimeout(() => changeImage('volume-down', false), 100);
    });






    // reports

    // Variables de referencia
    const reportMenu = document.getElementById('report-menu');
    const reportButton = document.getElementById('report-button');
    const suggestButton = document.getElementById('suggest-button');
    const reportForm = document.getElementById('form-reports');
    const suggestForm = document.getElementById('form-suggests');
    let selectedButtonIndex = 0; // Para navegación en el menú de reportes/sugerencias
    const menuButtons = [reportButton, suggestButton];
    const confirmationDialog = document.getElementById('confirmation-dialog');
    const confirmButton = document.getElementById('confirm-button');
    const backButton = document.getElementById('back-button');
    const successMessage = document.getElementById('success-message');

    // Función para seleccionar el botón del menú
    function selectMenuButton(index) {
        menuButtons.forEach((button, i) => {
            if (i === index) {
                button.classList.add('selected');
                button.focus();
            } else {
                button.classList.remove('selected');
            }
        });
        selectedButtonIndex = index;
    }

    // Función para seleccionar un campo del formulario
    function selectFormField(index, form) {
        const inputs = Array.from(form.querySelectorAll('input, textarea, select'));
        inputs.forEach((input, i) => {
            if (i === index) {
                input.classList.add('selected');
                input.focus();
            } else {
                input.classList.remove('selected');
            }
        });
    }

    // Navegar en el menú
    function navigateMenu(direction) {
        const newIndex = (selectedButtonIndex + (direction === 'right' ? 1 : -1) + menuButtons.length) % menuButtons.length;
        selectMenuButton(newIndex);
    }

    // Navegar en los campos del formulario
    function navigateFormFields(direction, form) {
        const inputs = Array.from(form.querySelectorAll('input, textarea, select, button'));
        const currentIndex = inputs.findIndex(input => input.classList.contains('selected'));
        const newIndex = (currentIndex + (direction === 'down' ? 1 : -1) + inputs.length) % inputs.length;
        selectFormField(newIndex, form);
    }

    // Función para validar el formulario
    function validateForm(form) {
        const inputs = form.querySelectorAll('input[type="text"], textarea');
        let valid = true;

        inputs.forEach(input => {
            if (input.value.trim() === '') {
                valid = false;
            }
        });

        if (!valid) {
            alert('Por favor, completa todos los campos obligatorios.');
        }

        return valid;
    }

    // Mostrar mensaje de confirmación
    function showConfirmationMessage() {
        confirmationDialog.classList.remove('hide');
        confirmButton.focus();
    }

    // Ocultar mensaje de confirmación
    function hideConfirmationMessage() {
        confirmationDialog.classList.add('hide');
    }

    // Mostrar mensaje de éxito
    function showSuccessMessage() {
        successMessage.classList.remove('hide');
        setTimeout(() => {
            successMessage.classList.add('hide');
            closeForm();
        }, 1500); // Desaparece después de 1.5 segundos
    }

    // Limpiar campos del formulario
    function clearFormFields(form) {
        form.reset();
    }

    // Cerrar formulario y volver al menú
    function closeForm() {
        reportForm.classList.add('hide');
        suggestForm.classList.add('hide');
        reportForm.classList.remove('show');
        suggestForm.classList.remove('show');
        reportMenu.style.display = 'flex';
        selectMenuButton(selectedButtonIndex);
    }

    // Manejo de teclas para el menú y formularios
    document.addEventListener('keydown', (event) => {
        const activeForm = document.querySelector('.form-container.show form');
        
        if (reportMenu.style.display !== 'none') {
            switch (event.key) {
                case 'ArrowRight':
                case 'ArrowLeft':
                    navigateMenu(event.key === 'ArrowRight' ? 'right' : 'left');
                    break;
                case 'Enter':
                    openForm(menuButtons[selectedButtonIndex].getAttribute('data-form'));
                    break;
                case 'Escape':
                    closeForm();
                    break;
            }
        } else if (activeForm) {
            switch (event.key) {
                
                case 'ArrowUp':
                case 'ArrowDown':
                    navigateFormFields(event.key === 'ArrowDown' ? 'down' : 'up', activeForm);
                    break;
                case 'Escape':
                    closeForm();
                    break;
            }
        }
    });

    /*
    // Envío de formulario cuando se presiona el botón "A"
    aButton.addEventListener('click', () => {
        const activeForm = document.querySelector('.form-container.show form');
        if (activeForm) {
            if (validateForm(activeForm)) {
                showConfirmationMessage();
            }
        }
    });

    // Envío de formularios con la tecla Enter o el botón "A"
    document.addEventListener('keydown', function(event) {
        const activeForm = document.querySelector('.form-container.show form');
        
        if (activeForm && (event.key === 'Enter')) {
            event.preventDefault(); // Prevenir el comportamiento por defecto del Enter
            if (validateForm(activeForm)) {
                showConfirmationMessage();
            }
        }
    });
    */

    // Manejo de teclas en la confirmación
    document.addEventListener('keydown', (event) => {
        if (!confirmationDialog.classList.contains('hide')) {
            switch (event.key) {
                case 'ArrowRight':
                case 'ArrowLeft':
                    if (document.activeElement === confirmButton) {
                        backButton.focus();
                    } else {
                        confirmButton.focus();
                    }
                    break;
                case 'Enter':
                    if (document.activeElement === confirmButton) {
                        hideConfirmationMessage();
                        showSuccessMessage();
                        const activeForm = document.querySelector('.form-container.show form');
                        if (activeForm) {
                            clearFormFields(activeForm);
                        }
                    } else if (document.activeElement === backButton) {
                        hideConfirmationMessage();
                    }
                    break;
                case 'Escape':
                    hideConfirmationMessage();
                    break;
            }
        }
    });


    // Envío de formularios con validación
    reportForm.addEventListener('submit', function(event) {
        event.preventDefault();
        if (validateForm(this)) {
            showConfirmationMessage();
        }
        clearFormFields(this);
    });

    suggestForm.addEventListener('submit', function(event) {
        event.preventDefault();
        if (validateForm(this)) {
            showConfirmationMessage();
        }
        clearFormFields(this);
    });

    // Abrir formulario
    function openForm(formId) {
        reportMenu.style.display = 'none';
        const form = document.getElementById(formId);
        form.classList.remove('hide');
        form.classList.add('show');

        const firstInput = form.querySelector('button:not([type="submit"]), textarea, select');
        if (firstInput) {
            selectFormField(0, form);
        }
    }

    // Inicializar el foco en el menú
    selectMenuButton(selectedButtonIndex);

    // Manejar la selección de relevancia con 'Enter'
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            const activeElement = document.activeElement;

            if (activeElement.classList.contains('relevance-button')) {
                selectRelevance(activeElement);
            }
        }
    });

    // Función para seleccionar la relevancia y cambiar el color de fondo
    function selectRelevance(button) {
        const relevanceButtons = document.querySelectorAll('.relevance-button');
        relevanceButtons.forEach(btn => {
            btn.classList.remove('selected');
            btn.style.backgroundColor = ''; // Restablecer color de fondo
            btn.style.color = '';
        });

        button.classList.add('selected');
        
        // Cambiar el color del fondo según la relevancia seleccionada
        const relevanceValue = button.getAttribute('data-value');
        switch (relevanceValue) {
            case '1':
                button.style.backgroundColor = '#ffff66'; // Baja relevancia
                console.log('se presiona baja relevancia')
                button.style.color = '#000000';
                break;
            case '2':
                button.style.backgroundColor = 'orange';
                button.style.color = '#000000'; // Media relevancia
                console.log('se presiona media relevancia')
                break;
            case '3':
                button.style.backgroundColor = 'red'; // Alta relevancia
                button.style.color = '#000000';
                console.log('se presiona alta relevancia')
                break;
        }

        // Guardar el valor de relevancia en el input oculto
        document.getElementById('report-relevance').value = relevanceValue;
    }

    // Asignar eventos de click a los botones de relevancia para selección manual
    const relevanceButtons = document.querySelectorAll('.relevance-button');
    relevanceButtons.forEach(button => {
        button.addEventListener('click', function() {
            selectRelevance(button);
        });
    });


    document.addEventListener('keydown', function(event) {
        if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
            event.preventDefault();
        }
    });


    //config

    const settingsOption = document.querySelectorAll('.setting-option');
    const editUserModal = document.getElementById('edit-user-modal');
    const settingsList = document.querySelector('.settings-list');

    // Función para actualizar el estado activo
    function updateActiveOption(index) {
        settingsOption.forEach((option, i) => {
            option.classList.toggle('active', i === index);
        });
    }

    // Navegación por las opciones usando flechas o botones del Nintendo
    document.addEventListener('keydown', (event) => {
        switch (event.key) {
            case 'ArrowUp': // Navegar hacia arriba
                currentIndex = (currentIndex > 0) ? currentIndex - 1 : settingsOption.length - 1;
                updateActiveOption(currentIndex);
                break;
            case 'ArrowDown': // Navegar hacia abajo
                currentIndex = (currentIndex < settingsOption.length - 1) ? currentIndex + 1 : 0;
                updateActiveOption(currentIndex);
                break;
            case 'Enter': // Seleccionar opción
                const selectedOption = settingsOption[currentIndex];
                const action = selectedOption.dataset.action;
                if (action) {
                    handleAction(action);
                } else {
                    console.log(`Opción seleccionada: ${selectedOption.querySelector('span').textContent}`);
                }
                break;
            case 'Escape':
                hideEditUserModal();
                break;
        }
    });

    function handleAction(action) {
        if (action === 'openUserModal') {
            openUserModal();
        }
    }

    function openUserModal() {
        if (isContentVisible('option6')){
            console.log('Abriendo modal para configurar usuario...');
            showEditUserModal();
        } else {
            return
        }
    }




    function loadAvatars(containerId) {
        const avatarContainer = document.getElementById('avatar-container');
        const avatarSelection = document.getElementById(containerId);
    
        if (!avatarContainer || !avatarSelection) {
            console.error('No se encontró el contenedor de avatares.');
            return;
        }
    
        // Limpiamos solo si el contenedor está vacío
        if (!avatarSelection.hasChildNodes()) {
            avatarSelection.innerHTML = ''; // Limpiar el contenido existente solo una vez.
        }
    
        // Clonamos los avatares del contenedor original
        const clonedAvatars = avatarContainer.cloneNode(true);
        clonedAvatars.classList.remove('hide'); // Aseguramos que el contenedor de avatares no esté oculto.
    
        // Seleccionamos todas las imágenes de avatares
        const avatars = clonedAvatars.querySelectorAll('.avatar');
        avatars.forEach(img => img.classList.remove('selected')); // Eliminamos cualquier selección anterior.
    
        // Insertamos el contenedor clonado con los avatares
        avatarSelection.appendChild(clonedAvatars);
    
        const avatarImages = avatarSelection.querySelectorAll('.avatar');
        avatarImages.forEach(img => {
    
            img.addEventListener('click', function () {
                avatarImages.forEach(img => {
                    img.classList.remove('selected');
                    
                    const nameElement = img.nextElementSibling;
                    if (nameElement && nameElement.classList.contains('avatar-name')) {
                        nameElement.remove();
                    }
                });
                // Agregamos la clase 'selected' al avatar que fue clicado
                this.classList.add('selected');
                
                // Obtenemos el avatar seleccionado
                selectedAvatar = this.getAttribute('data-avatar');
                
                // Mostramos el nombre debajo del avatar seleccionado
                const avatarName = this.getAttribute('name');
                let nameElement = this.nextElementSibling;
                
                // Si ya existe un nombre mostrado, lo actualizamos
                if (nameElement && nameElement.classList.contains('avatar-name')) {
                    nameElement.textContent = avatarName;
                } else {
                    // Creamos el elemento del nombre si no existe
                    nameElement = document.createElement('div');
                    nameElement.classList.add('avatar-name');
                    nameElement.textContent = avatarName;
                    this.parentNode.insertBefore(nameElement, this.nextSibling);
                }
    
                console.log("Avatar seleccionado:", selectedAvatar);
                console.log("Nombre del avatar:", avatarName);
            });
        });
    }
    
    
    function showCreateUserModal() {
        document.getElementById('create-user-modal').classList.remove('hide');
        loadAvatars('create-avatar-selection');
    }

    function showEditUserModal() {
        const usernameInput = document.getElementById('edit-username');
        const avatarSelection = document.getElementById('edit-avatar-selection');
        
        const savedUsername = localStorage.getItem('username');
        const savedAvatar = localStorage.getItem('avatar');
    
        usernameInput.value = savedUsername;
    
        // Limpiar el contenedor antes de cargar los avatares
        avatarSelection.innerHTML = '';
    
        // Cargar avatares
        loadAvatars('edit-avatar-selection');
    
        const avatars = avatarSelection.querySelectorAll('.avatar');
    
        // Remover la clase 'selected' de todos los avatares y ocultar las bases de nombres (líneas azules)
        avatars.forEach((img) => {
            img.classList.remove('selected');
            const baseName = img.nextElementSibling;
            if (baseName && baseName.classList.contains('avatar-name')) {
                baseName.style.visibility = 'hidden';  // Oculta la base de nombre inicialmente
            }
        });
    
        // Seleccionar el avatar guardado en el localStorage
        avatars.forEach((img, index) => {
            if (img.getAttribute('data-avatar') === savedAvatar) {
                img.classList.add('selected');
                img.focus();
                selectedIndex = index;
    
                // Mostrar la base del nombre y el nombre del avatar guardado debajo
                const avatarName = img.getAttribute('name');
                let nameElement = img.nextElementSibling;
    
                if (!nameElement || !nameElement.classList.contains('avatar-name')) {
                    // Crear el elemento de nombre si no existe
                    nameElement = document.createElement('div');
                    nameElement.classList.add('avatar-name');
                    img.parentNode.insertBefore(nameElement, img.nextSibling);
                }
                nameElement.textContent = avatarName;
                nameElement.style.visibility = 'visible';  // Muestra la base del nombre
            }
        });
    
        document.getElementById('edit-user-modal').classList.remove('hide');
        document.getElementById('edit-user-modal').classList.add('show');
        settingsList.classList.add('hide');
    
        // Enfocar el input de nombre
        if (usernameInput) {
            usernameInput.focus();
        }
    
        console.log(usernameInput.value);
    }
    
    


    const avatars = document.querySelectorAll('.avatar-item img');
    avatars.forEach(avatar => {
    avatar.addEventListener('click', function() {
        // Obtener el nombre del avatar seleccionado
        const avatarName = this.getAttribute('name');
        
        // Ocultar nombres de todos los avatares
        const nameElements = document.querySelectorAll('.avatar-name');
        nameElements.forEach(nameElement => {
            nameElement.textContent = ''; // Limpia el contenido
        });
        
        // Mostrar el nombre del avatar seleccionado
        const selectedNameElement = this.nextElementSibling;
        selectedNameElement.textContent = avatarName; // Muestra el nombre
    });
});
    
    

    function showConfirmationDialog(selectedAvatar, username) {
        const confirmation = confirm(`¿Confirmas el cambio de avatar a ${selectedAvatar} y nombre de usuario a ${username}?`);
        
        if (confirmation) {

            localStorage.setItem('avatar', selectedAvatar);
            localStorage.setItem('username', username);
    
            document.getElementById('edit-user-modal').classList.add('hide');
            
            document.getElementById('config-list').classList.remove('hide');
        }
    }
    

    function hideEditUserModal() {
        document.getElementById('edit-user-modal').classList.add('hide');
        settingsList.classList.remove('hide');
        loadAvatars('edit-avatar-selection');
        
    }

        // Variables
        const overlay = document.getElementById('overlay');
        const createModal = document.getElementById('create-user-modal');
        const submitButton = document.getElementById('submit-user');
        const avatarImages = document.querySelectorAll('.avatar');
        const userInfo = document.getElementById('user-info');
        let selectedAvatar = '';
    
        if (!localStorage.getItem('username') || !localStorage.getItem('avatar')) {
            console.log("No hay usuario en localStorage, mostrando modal");
            overlay.style.display = 'block';
            createModal.style.display = 'block';
            console.log('se esta mostrando el modal')
            showCreateUserModal();
        } else {
            console.log("Usuario encontrado en localStorage, mostrando información del usuario");
            showUserInfo();
        }
    
    
        avatarImages.forEach(img => {
            img.addEventListener('click', function () {
                avatarImages.forEach(img => img.classList.remove('selected'));
                this.classList.add('selected');
                selectedAvatar = this.getAttribute('data-avatar');
                console.log("Avatar seleccionado:", selectedAvatar);
            });
        });
    
        // Guardar usuario y avatar en localStorage
        submitButton.addEventListener('click', function () {
            const username = document.getElementById('username').value;
            console.log("Nombre ingresado:", username);
            if (username && selectedAvatar) {
                localStorage.setItem('username', username);
                localStorage.setItem('avatar', selectedAvatar);
                console.log("Usuario guardado en localStorage");
                overlay.style.display = 'none';
                createModal.style.display = 'none';
                showUserInfo();
            } else {
                alert('Por favor, ingrese un nombre y seleccione un avatar.');
            }
        });
    
        // Mostrar información del usuario
        function showUserInfo() {
            let username = localStorage.getItem('username');
            let avatar = localStorage.getItem('avatar');
            userInfo.innerHTML = `
                <img src="${avatar}" alt="Avatar">
                <span>${username}</span>
            `;
            userInfo.style.display = 'flex';
        }

        let currentAvatarIndex = 0;

        // Función para manejar la navegación con las flechas y permitir índices circulares
        function handleAvatarNavigation(event) {
            const avatarSelection = document.getElementById('edit-avatar-selection') || ('create-avatar-selection');
            const avatars = Array.from(avatarSelection.querySelectorAll('.avatar'));
            const rowLength = 7;
        
            // Quitar la clase seleccionada del avatar actual
            avatars[currentAvatarIndex].classList.remove('selected');
        
            switch (event.key) {
                case 'ArrowUp':
                    // Si estamos en una fila superior, saltamos a la última fila.
                    if (currentAvatarIndex - rowLength < 0) {
                        currentAvatarIndex = (avatars.length - rowLength) + (currentAvatarIndex % rowLength);
                    } else {
                        currentAvatarIndex -= rowLength;
                    }
                    break;
                case 'ArrowDown':
                    // Si estamos en la última fila, saltamos a la fila superior.
                    if (currentAvatarIndex + rowLength >= avatars.length) {
                        currentAvatarIndex = currentAvatarIndex % rowLength;
                    } else {
                        currentAvatarIndex += rowLength;
                    }
                    break;
                case 'ArrowLeft':
                    // Si estamos en el primer avatar, saltamos al último.
                    if (currentAvatarIndex === 0) {
                        currentAvatarIndex = avatars.length - 1;
                    } else {
                        currentAvatarIndex--;
                    }
                    break;
                case 'ArrowRight':
                    // Si estamos en el último avatar, saltamos al primero.
                    if (currentAvatarIndex === avatars.length - 1) {
                        currentAvatarIndex = 0;
                    } else {
                        currentAvatarIndex++;
                    }
                    break;
                case 'Enter':

                    const selectedAvatar = avatars[currentAvatarIndex].getAttribute('data-avatar');
                    avatars[currentAvatarIndex].classList.add('selected');
                    localStorage.setItem('avatar', selectedAvatar); // Guardar en localStorage
                    console.log("Avatar seleccionado:", selectedAvatar);
                    break;
            }
        
            avatars[currentAvatarIndex].classList.add('selected');
        }
        
        document.addEventListener('keydown', function(event) {
            if (document.getElementById('edit-user-modal').classList.contains('hide') === false) {
                handleAvatarNavigation(event);
            }
        });
        





    updateActiveOption(0);
    updateCarousel(0);
    updateSelectedFolder(0);
    updateActiveContact(0);
    updateNintendoTime(0);
    updateSelectedOption(0);
    updateCards(0);
    

});