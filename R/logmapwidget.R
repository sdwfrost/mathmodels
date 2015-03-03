#' <Add Title>
#'
#' <Add Description>
#'
#' @import htmlwidgets
#'
#' @export
logmapwidget <- function(width = NULL, height = NULL) {

  # forward options using x
  x = list()

  # create widget
  htmlwidgets::createWidget(
    name = 'logmapwidget',
    x,
    width = width,
    height = height,
    package = 'mathmodels'
  )
}

#' Widget output function for use in Shiny
#'
#' @export
logmapwidgetOutput <- function(outputId, width = '100%', height = '400px'){
  shinyWidgetOutput(outputId, 'logmapwidget', width, height, package = 'mathmodels')
}

#' Widget render function for use in Shiny
#'
#' @export
renderLogmapwidget <- function(expr, env = parent.frame(), quoted = FALSE) {
  if (!quoted) { expr <- substitute(expr) } # force quoted
  shinyRenderWidget(expr, logmapwidgetOutput, env, quoted = TRUE)
}
