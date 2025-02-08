import React, { useState } from "react";
import { MDBTabs, MDBTabsItem, MDBTabsLink, MDBTabsContent, MDBTabsPane, MDBInput, MDBBtn } from "mdb-react-ui-kit";

export function UserPage() {
  const [justifyActive, setJustifyActive] = useState('tab1');

  const handleJustifyClick = (value: string) => {
    if (value === justifyActive) {
      return;
    }
    setJustifyActive(value);
  };

  return (
    <>
    <main>
      <div className="m-5">
      <MDBTabs pills justify className='mb-3'>
        <MDBTabsItem>
          <MDBTabsLink onClick={() => handleJustifyClick('tab1')} active={justifyActive === 'tab1'} className={justifyActive === 'tab1' ? 'active-tab' : ''}>
            User info
          </MDBTabsLink>
        </MDBTabsItem>
        <MDBTabsItem>
          <MDBTabsLink onClick={() => handleJustifyClick('tab2')} active={justifyActive === 'tab2'} className={justifyActive === 'tab2' ? 'active-tab' : ''}>
            Address configuration
          </MDBTabsLink>
        </MDBTabsItem>
        <MDBTabsItem>
          <MDBTabsLink onClick={() => handleJustifyClick('tab3')} active={justifyActive === 'tab3'} className={justifyActive === 'tab3' ? 'active-tab' : ''}>
            Past orders
          </MDBTabsLink>
        </MDBTabsItem>
      </MDBTabs>

      <MDBTabsContent>
        <MDBTabsPane open={justifyActive === 'tab1'}>Tab 1 content</MDBTabsPane>
        <MDBTabsPane open={justifyActive === 'tab2'}>Tab 2 content</MDBTabsPane>
        <MDBTabsPane open={justifyActive === 'tab3'}>Tab 3 content</MDBTabsPane>
      </MDBTabsContent>
      </div>
      </main>
    </>
  );
}
