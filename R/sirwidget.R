#' <Add Title>
#'
#' <Add Description>
#'
#' @import htmlwidgets
#'
#' @export
sirwidget <- function(width = NULL, height = NULL) {

  # forward options using x
  x = list()

  # create widget
  htmlwidgets::createWidget(
    name = 'sirwidget',
    x,
    width = width,
    height = height,
    package = 'mathmodels'
  )
}

#' Widget output function for use in Shiny
#'
#' @export
sirwidgetOutput <- function(outputId, width = '100%', height = '400px'){
  shinyWidgetOutput(outputId, 'predpreywidget', width, height, package = 'mathmodels')
}

#' Widget render function for use in Shiny
#'
#' @export
renderSirwidget <- function(expr, env = parent.frame(), quoted = FALSE) {
  if (!quoted) { expr <- substitute(expr) } # force quoted
  shinyRenderWidget(expr, sirwidgetOutput, env, quoted = TRUE)
}
