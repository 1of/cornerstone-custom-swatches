export default function customSwatches() {
  const dropdown = $('.custom-swatch-select');

  if (dropdown.length) {
    $(dropdown).each(function () {
      const select = $(this);
      const dropdownSelectId = $(select).attr('id');
      const modalSwatch = $(select).find('.swatch-modal');
      const dropdownSelectText = $(select).find('.selected-swatch');
      const dropdownSelectColor = $(select).find('.selected-color');
      const selectedColorOnHover = $(modalSwatch).find('.swatch-selected');

      // Show custom swatches on dropdown click
      $(this).on('click touch', () => {
        const elId = $(modalSwatch).attr('id');
        if ($(modalSwatch).css('display') === 'none') {
          $(modalSwatch).show(200); // show current swatch options
          $(`.custom-swatch-select .swatch-modal:not(#${elId})`).hide(200); // hide others modal swatch options
        } else {
          $(modalSwatch).hide(200);
        }
      });

      // Swatch onHover & click
      $(modalSwatch).find('.form-option-variant').each(function () {
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
      const container = document.getElementById(dropdownSelectId);
      if ($(container).length) {
        document.addEventListener('click', function (event) {
          if (container !== event.target && !container.contains(event.target)) {
            $(modalSwatch).hide(200);
          }
        });
      }
    });
  }
}
