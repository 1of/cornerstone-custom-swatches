/*
 Import all product specific js
 */
import PageManager from './page-manager';
import Review from './product/reviews';
import collapsibleFactory from './common/collapsible';
import ProductDetails from './common/product-details';
import videoGallery from './product/video-gallery';
import { classifyForm } from './common/utils/form-utils';
import modalFactory, { modalTypes } from './global/modal';

const { WRITE_REVIEW } = modalTypes;

export default class Product extends PageManager {
    constructor(context) {
        super(context);
        this.url = window.location.href;
        this.$reviewLink = $('[data-reveal-id="modal-review-form"]');
        this.$bulkPricingLink = $('[data-reveal-id="modal-bulk-pricing"]');
        this.reviewModal = modalFactory('#modal-review-form')[0];
    }

    onReady() {
        // Listen for foundation modal close events to sanitize URL after review.
        $(document).on('close.fndtn.reveal', () => {
            if (this.url.indexOf('#write_review') !== -1 && typeof window.history.replaceState === 'function') {
                window.history.replaceState(null, document.title, window.location.pathname);
            }
        });

        let validator;

        // Init collapsible
        collapsibleFactory();

        this.productDetails = new ProductDetails($('.productView'), this.context, window.BCData.product_attributes);
        this.productDetails.setProductVariant();

        videoGallery();

        this.bulkPricingHandler();

        const $reviewForm = classifyForm('.writeReview-form');

        if ($reviewForm.length === 0) return;

        const review = new Review($reviewForm);

        $(document).on('opened.fndtn.reveal', '#modal-review-form', () => this.reviewModal.setupFocusableElements(WRITE_REVIEW));

        $('body').on('click', '[data-reveal-id="modal-review-form"]', () => {
            validator = review.registerValidation(this.context);
            this.ariaDescribeReviewInputs($reviewForm);
        });

        $reviewForm.on('submit', () => {
            if (validator) {
                validator.performCheck();
                return validator.areAll('valid');
            }

            return false;
        });

        this.productReviewHandler();

      // Custom Dropdown events
      if ($('.custom-swatch-select').length) {
        $('.custom-swatch-select').each(function () {
          let select = $(this);
          const dropdownSelectId = $(this).attr('id');
          const modalSwatch = $(this).find('.swatch-modal');
          const dropdownSelectText = $(this).find('.selected-swatch');
          const dropdownSelectColor = $(this).find('.selected-color');
          const selectedColorOnHover = $(modalSwatch).find('.swatch-selected');
          // Show custom swatches
          $(this).on('click touch', () => {
            const elId = $(modalSwatch).attr('id');
            if ($(modalSwatch).css('display') === 'none') {
              $(modalSwatch).show(100);
              $(`.custom-swatch-select .swatch-modal:not(#${elId})`).hide(200);
            } else {
              $(modalSwatch).hide(200);
            }
          });
          // Swatch On Mouseleave id needed
          $(modalSwatch).mouseleave(function () {
            // setTimeout(()=>{ $(this).hide(300); }, 3000);
          });

          // Swatch onHover & click
          $(modalSwatch).find('.form-option-variant').each(function () {
            $(this).hover(function () {
              $(selectedColorOnHover).text(this.title);
            });
            // Swatch click
            $(this).closest('.form-option-swatch').on('touchstart click', function(){
              console.log(this);
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
              } else {
                return
              }
            });
          }
        });
      }
    }

    ariaDescribeReviewInputs($form) {
        $form.find('[data-input]').each((_, input) => {
            const $input = $(input);
            const msgSpanId = `${$input.attr('name')}-msg`;

            $input.siblings('span').attr('id', msgSpanId);
            $input.attr('aria-describedby', msgSpanId);
        });
    }

    productReviewHandler() {
        if (this.url.indexOf('#write_review') !== -1) {
            this.$reviewLink.trigger('click');
        }
    }

    bulkPricingHandler() {
        if (this.url.indexOf('#bulk_pricing') !== -1) {
            this.$bulkPricingLink.trigger('click');
        }
    }
}
