export default function customSwatches() {
    const dropdown = $('.custom-swatch-select');

    if (dropdown.length) {
        // Execute on each product variant options
        $(dropdown).each(function () {
            const select = $(this);
            const container = document.getElementById($(select).attr('id'));
            const modalSwatch = $(select).find('.swatch-modal');
            const dropdownSelectText = $(select).find('.selected-swatch');
            const dropdownSelectColor = $(select).find('.selected-color');
            const selectedColorOnHover = $(modalSwatch).find('.swatch-selected');

            // Show custom modal with swatches on dropdown click
            $(this).on('click touch', () => {
                const elId = $(modalSwatch).attr('id');
                if ($(modalSwatch).css('display') === 'none') {
                    $(modalSwatch).show(200); // show current swatch options
                    $(`.custom-swatch-select .swatch-modal:not(#${elId})`).hide(200); // hide others modal swatch options
                } else {
                    $(modalSwatch).hide(200);
                }
            });

            // Bind events
            $(modalSwatch).find('.form-option-variant').each(function () {
                // Swatch hover
                $(this).hover(function () {
                    $(selectedColorOnHover).text(this.title);
                });

                // Swatch click
                $(this).closest('.form-option-swatch').on('touchstart click', function(){
                    const clone = $(this).children('.form-option-variant').clone();
                    $(dropdownSelectText).text($(clone).attr('title'));
                    $(dropdownSelectColor).html(clone);
                    $(select).css('padding-left', '45px');
                });
            });

            // Click outside custom dropdown
            if ($(container).length) {
                document.addEventListener('click', (e) => {
                    if (container !== e.target && !container.contains(e.target)) {
                        $(modalSwatch).hide(200);
                    }
                });
            }
        });
    }
}
