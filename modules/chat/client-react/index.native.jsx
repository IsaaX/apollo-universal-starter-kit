import React from 'react';
import { createStackNavigator } from 'react-navigation';

import ClientModule from '@module/module-client-react/index.native';
import { translate } from '@module/i18n-client-react';
import { HeaderTitle, IconButton } from '../../../packages/client/src/modules/common/components/native';
import Chat from './containers/ChatOperations';
import resources from './locales';

const HeaderTitleWithI18n = translate('chat')(HeaderTitle);

export default new ClientModule({
  drawerItem: [
    {
      Chat: {
        screen: createStackNavigator({
          Chat: {
            screen: Chat,
            navigationOptions: ({ navigation }) => ({
              headerTitle: <HeaderTitleWithI18n style="subTitle" />,
              headerLeft: (
                <IconButton iconName="menu" iconSize={32} iconColor="#0275d8" onPress={() => navigation.openDrawer()} />
              )
            })
          }
        }),
        navigationOptions: {
          drawerLabel: <HeaderTitleWithI18n />
        }
      }
    }
  ],
  localization: [{ ns: 'chat', resources }]
});
