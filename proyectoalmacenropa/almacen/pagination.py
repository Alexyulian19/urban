from rest_framework.pagination import PageNumberPagination


class PaginacionOpcional(PageNumberPagination):
    """Pagina solo cuando se envía ?page=; así la interfaz puede pedir listas completas o por páginas."""
    page_size = 20
    page_size_query_param = 'page_size'
    max_page_size = 200

    def paginate_queryset(self, queryset, request, view=None):
        if 'page' not in request.query_params:
            return None
        return super().paginate_queryset(queryset, request, view)
