/**
 * @todo, sort by hue http://www.runtime-era.com/2011/11/grouping-html-hex-colors-by-hue-in.html
 */

var themeParser = (function(){

    var theme = 'themes/Slush & Poppies.tmTheme',
        colors,
        $palette,
        $swatches,
        activeClass = 'is-active';

    function init( data ) {
        colors = stripColorsFromString( stripMarkupToString( data ) );
        $palette = buildColorPallete( colors );
        $swatches = $palette.children();
        $('body').append( $palette );
    }

    function stripMarkupToString( data ) {
        return $('<div>').append( data ).text();
    }

    function stripColorsFromString( string ) {

        var // http://blog.jasonlang.me/twitter-hashtags-javascript-and-regex
            colors = string.match(/(#[A-Za-z0-9\-\_]+)/g),
            uniqueColors = [];

        if ( colors !== null ) {
            $.each( colors, function( i, color ){
                if( $.inArray( color, uniqueColors ) === -1 ) uniqueColors.push( color );
            });
        }

        return uniqueColors;
    }

    function buildSingleColorSwatch( position, color ) {
        var translateX = position * ( 2 ),
            convertedColor = convertHex( color );
            $container = $('<figure></figure>').addClass('swatch'),
            $color = $('<div></div>').addClass('swatch-color').css( 'background-color', convertedColor ),
            //$title = $('<figcaption></figcaption>').addClass('swatch-name').text( color + ', ' + convertedColor );
            $title = $('<figcaption></figcaption>').addClass('swatch-name').text( color );

        $container.click( toggleSwatch );
        $container.css( 'left', translateX + 'em' );
        $container.attr( 'data-left', translateX + 'em' );
        //$container.css( '-webkit-transform', 'perspective( 600px ) rotateX( 0deg ) rotateY( 45deg ) translateX( ' + translateX + 'em' + ' )' );


        return $container.append( $color, $title );
    }

    function buildColorPallete( colors ) {
        var $paletteContainer = $('<section></section>').addClass('palette'),
            $paletteTitle = $('<h1></h1>').text( theme.replace('../../themes/', '') );

        $paletteContainer.append( $paletteTitle );

        $.each( colors, function( i, color ){
            $paletteContainer.append( buildSingleColorSwatch( i, color ) );
        });

        return $paletteContainer;
    }

    function convertHex( color ) {

        // http://jsfiddle.net/ekinertac/3Evx5/1/
        // http://stackoverflow.com/questions/3641836/javascript-to-get-alpha-value-from-hex
        var hex = color.replace('#',''),
            r = parseInt(hex.substring(0,2), 16),
            g = parseInt(hex.substring(2,4), 16),
            b = parseInt(hex.substring(4,6), 16),
            a = parseInt(hex.substring(6,8), 16) / 255;

        if ( isNaN( a ) ) {
            return 'rgb('+r+','+g+','+b+')';
        } else {
            return 'rgba('+r+','+g+','+b+','+a+')';
        }
    }

    function toggleSwatch( event ) {

        var $this = $( this ),
            translateX = $swatches.filter('.is-active').length * ( 10 + 1 );

        $palette.addClass( activeClass );
        $this.toggleClass( activeClass );

        if ( $this.is('.is-active') ) {

            if ( ( translateX + 10 ) * 16 < $(document).width() ) {
                $this.css( 'top', '-18em' );
                $this.css( 'left', translateX + 'em' );
            } else {
                $this.css( 'top', '-10em' );
                $this.css( 'left', '0em' );
            }

        } else {
            $this.css( 'top', '3em' );
            $this.css( 'left', $this.data('left') );
        }

    }

    // Initiate!
    $(function() {
        $.get( theme ).done( init );
    });

    // Publicly accessible properties
    return {
        getTheme: function() {
            return theme;
        }
    };

}());