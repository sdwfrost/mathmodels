#' <Add Title>
#'
#' <Add Description>
#'
#' @import htmlwidgets
#'
#' @export
logisticwidget <- function(width = NULL, height = NULL) {

  # forward options using x
  x = list()

  # create widget
  htmlwidgets::createWidget(
    name = 'logisticwidget',
    x,
    width = width,
    height = height,
    package = 'mathmodels'
  )
}

#' Widget output function for use in Shiny
#'
#' @export
logisticwidgetOutput <- function(outputId, width = '100%', height = '400px'){
  shinyWidgetOutput(outputId, 'logisticwidget', width, height, package = 'mathmodels')
}

#' Widget render function for use in Shiny
#'
#' @export
renderLogisticwidget <- function(expr, env = parent.frame(), quoted = FALSE) {
  if (!quoted) { expr <- substitute(expr) } # force quoted
  shinyRenderWidget(expr, logisticwidgetOutput, env, quoted = TRUE)
}
