# intro

This is a really simple interactive scatter plot for viewing tsne embeddings. I built it to experiment with Uber's deck.gl library.

Note: the plot is zoomed pretty far out at the start, so it's pretty hard to hover over exact points. Zoom in using your mouse wheel or by double clicking and the points should increase in size.

# interfaces

non-react

react


# Issues

1. How to best handle style with the tooltip for scatter-raw - should the user have the option to pass a style prop in? Or should there just be a (non-modifiable) default style that can be overriden by the user's renderTooltip method? I like option 2 more, even though it might not be the absolutely most clear thing in the world.