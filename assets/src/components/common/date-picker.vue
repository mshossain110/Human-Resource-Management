<template>
    <input type="text" :value="value">
</template>

<script>
    export default {
        props: ['value', 'dependency'],
        mounted: function() {
            var self = this,
                limit_date = ( self.dependency == 'pm-datepickter-from' ) ? "minDate" : "maxDate";
            
            jQuery( self.$el ).datepicker({
                dateFormat: 'yy-mm-dd',
                changeYear: true,
                changeMonth: true,
                numberOfMonths: 1,
                onClose: function( selectedDate ) {
                    jQuery( "."+ self.dependency ).datepicker( "option", limit_date, selectedDate );
                },
                onSelect: function(dateText) {
                   self.$emit('input', dateText);
                }
            });

            jQuery(self.$el).on("change", function() {
                var date = jQuery(self.$el).val();
                self.$emit('input', date);
            });
        },
    }
</script>