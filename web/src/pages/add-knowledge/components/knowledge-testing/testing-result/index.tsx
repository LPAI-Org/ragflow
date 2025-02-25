import { ReactComponent as SelectedFilesCollapseIcon } from '@/assets/svg/selected-files-collapse.svg';
import Image from '@/components/image';
import { ITestingChunk } from '@/interfaces/database/knowledge';
import {
  Card,
  Collapse,
  Flex,
  Pagination,
  PaginationProps,
  Popover,
  Space,
} from 'antd';
import { useDispatch, useSelector } from 'umi';
import { TestingModelState } from '../model';
import styles from './index.less';
import SelectFiles from './select-files';

const similarityList: Array<{ field: keyof ITestingChunk; label: string }> = [
  { field: 'similarity', label: 'Hybrid Similarity' },
  { field: 'term_similarity', label: 'Term Similarity' },
  { field: 'vector_similarity', label: 'Vector Similarity' },
];

const ChunkTitle = ({ item }: { item: ITestingChunk }) => {
  return (
    <Flex gap={10}>
      {similarityList.map((x) => (
        <Space key={x.field}>
          <span className={styles.similarityCircle}>
            {((item[x.field] as number) * 100).toFixed(2)}
          </span>
          <span className={styles.similarityText}>{x.label}</span>
        </Space>
      ))}
    </Flex>
  );
};

interface IProps {
  handleTesting: () => Promise<any>;
}

const TestingResult = ({ handleTesting }: IProps) => {
  const {
    documents,
    chunks,
    total,
    pagination,
    selectedDocumentIds,
  }: TestingModelState = useSelector((state: any) => state.testingModel);
  const dispatch = useDispatch();

  const onChange: PaginationProps['onChange'] = (pageNumber, pageSize) => {
    console.log('Page: ', pageNumber, pageSize);
    dispatch({
      type: 'testingModel/setPagination',
      payload: { current: pageNumber, pageSize },
    });
    handleTesting();
  };

  return (
    <section className={styles.testingResultWrapper}>
      <Collapse
        expandIcon={() => (
          <SelectedFilesCollapseIcon></SelectedFilesCollapseIcon>
        )}
        className={styles.selectFilesCollapse}
        items={[
          {
            key: '1',
            label: (
              <Flex
                justify={'space-between'}
                align="center"
                className={styles.selectFilesTitle}
              >
                <span>
                  {selectedDocumentIds?.length ?? 0}/{documents.length} Files
                  Selected
                </span>
                <Space size={52}>
                  <b>Hits</b>
                  <b>View</b>
                </Space>
              </Flex>
            ),
            children: (
              <div>
                <SelectFiles handleTesting={handleTesting}></SelectFiles>
              </div>
            ),
          },
        ]}
      />
      <Flex
        gap={'large'}
        vertical
        flex={1}
        className={styles.selectFilesCollapse}
      >
        {chunks.map((x) => (
          <Card key={x.chunk_id} title={<ChunkTitle item={x}></ChunkTitle>}>
            <Flex gap={'middle'}>
              {x.img_id && (
                <Popover
                  placement="left"
                  content={
                    <Image
                      id={x.img_id}
                      className={styles.imagePreview}
                    ></Image>
                  }
                >
                  <Image id={x.img_id} className={styles.image}></Image>
                </Popover>
              )}
              <div>{x.content_with_weight}</div>
            </Flex>
          </Card>
        ))}
      </Flex>
      <Pagination
        size={'small'}
        showQuickJumper
        current={pagination.current}
        pageSize={pagination.pageSize}
        total={total}
        showSizeChanger
        onChange={onChange}
      />
    </section>
  );
};

export default TestingResult;
