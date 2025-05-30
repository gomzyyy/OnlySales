import {View, FlatList} from 'react-native';
import React, {useEffect, useState} from 'react';
import Header from '../../components/Header';
import {useTheme} from '../../hooks';
import FS from 'react-native-fs';
import Tab from './components/Tab';
import EmptyListMessage from '../../components/EmptyListMessage';

const Invoices = () => {
  const {currentTheme} = useTheme();
  const [invoiceFiles, setInvoiceFiles] = useState<FS.ReadDirItem[]>([]);
  const getFSFiles = async () => {
    const customerInvoicesPath = `${FS.ExternalDirectoryPath}/Customer_Invoices`;

    const exists = await FS.exists(customerInvoicesPath);
    if (!exists) {
      await FS.mkdir(customerInvoicesPath);
      await FS.unlink(`${customerInvoicesPath}/Hello.pdf`);
    }
    const files = await FS.readDir(customerInvoicesPath);
    setInvoiceFiles(files);
  };
  useEffect(() => {
    getFSFiles();
  }, [invoiceFiles]);
  return (
    <View style={{flex: 1, backgroundColor: currentTheme.contrastColor}}>
      <Header
        name={'Invoices'}
        backButton={true}
        titleColor={currentTheme.header.textColor}
        headerBgColor={currentTheme.baseColor}
        curved
      />
      <View style={{flex: 1, paddingHorizontal: 10}}>
        <View style={{flex: 1, marginTop: 20}}>
          {invoiceFiles.length > 0 ? (
            <FlatList
              data={invoiceFiles}
              keyExtractor={s => s.path}
              renderItem={({item, index}) => <Tab file={item} />}
              style={{flex: 1}}
            />
          ) : (
            <EmptyListMessage title="No Invoice files found." />
          )}
        </View>
      </View>
    </View>
  );
};

export default Invoices;
