import Card from "@/components/Card";
import SearchPage from "@/components/SearchPage";
import { getCatalogAPI } from "@/data/api/CatalogAPI";
import { USE_QUERY_CONFIGS } from "@/data/constants/utils";
import useDebounce from "@/hooks/useDebounce";
import { currencyFormat, isToday } from "@/lib/utils";
import { useInfiniteQuery } from "@tanstack/react-query";

export default function CatalogPage() {
    const [searchValue, setSearchValue] = useDebounce({timeout: 800})
    const { data, isFetchingNextPage, fetchNextPage, hasNextPage } = useInfiniteQuery({
        queryKey: ['get_catalog', searchValue],
        queryFn: ({ pageParam = 1 }) => getCatalogAPI(searchValue, pageParam),
        getNextPageParam: (lastPage) => {
            const nextPage = lastPage.page + 1;
            return nextPage <= lastPage.totalPages ? nextPage : undefined;
        },
        ...USE_QUERY_CONFIGS
    });

    const catalogData = data?.pages.flatMap((page) => page.data) || [];

    return (
        <SearchPage>
            <SearchPage.Title>Meu Catálogo</SearchPage.Title>
            <SearchPage.SearchBar placeholder="Pesquise suas peças e serviços aqui..." onChange={(e) => {setSearchValue(e.target.value)}}/>
            <Card.Container>
                {catalogData.map((item: any) => (
                    <Card className="min-w-[300px]" key={item.id}>
                        {isToday(new Date(item.createdAt)) && <Card.Badge>Novo</Card.Badge>}
                        <Card.Header title={item.description} description={item.sku || 'sem código'} />
                        <Card.Content>
                            <p className="text-right font-medium">{currencyFormat(item.value, 'currency')}</p>
                        </Card.Content>
                    </Card>
                ))}
            </Card.Container>
            <SearchPage.LoadMore visible={hasNextPage} loading={isFetchingNextPage} onClick={() => fetchNextPage()}>Ver mais</SearchPage.LoadMore>
        </SearchPage>
    );
}