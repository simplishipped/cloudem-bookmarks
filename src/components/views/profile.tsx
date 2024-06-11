import { Component, createSignal, Show } from "solid-js";
import EditableInfoRow from "../molecules/editable-info-row";
import Button from "../atoms/button";
import useUser from "../../state/actions/user-actions";
import Input from "../atoms/input";

interface Props {

}

const Profile: Component<Props> = (props) => {

  const userProps = useUser();
  const [email, setEmail] = createSignal(userProps.user().email);
  const [username, setUsername] = createSignal(userProps.user().username);
  const [editMode, setEditMode] = createSignal(false);
  const [newPassword, setNewPassword] = createSignal('');

  const [confirmPassword, setConfirmPassword] = createSignal('');

  const [currentPassword, setCurrentPassword] = createSignal('');



  return (
    <div class="px-6 mt-2">
      <div class="mt-2">
        <EditableInfoRow title="Username" value={username} setValue={setUsername} editMode={editMode()} />
      </div>
      <div class="mt-4">
        <EditableInfoRow title="Email" value={email} setValue={setEmail} editMode={editMode()} />
      </div>
      <Show when={editMode()} fallback={<Button title="Update" func={() => setEditMode(true)} />}>
      <div class="text-md text-primaryButtonLight dark:text-primaryButtonDark mb-2 mt-4">New Password</div>

        <div class="mt-2">
          <Input placeholder="New Password" value={newPassword} setValue={setNewPassword} />
        </div>
        <div class="mt-2">
          <Input placeholder="Confirm Password" value={confirmPassword} setValue={setConfirmPassword} />
        </div>
        <div class="mt-2">
          <Input placeholder="Current Password" value={currentPassword} setValue={setCurrentPassword} />
        </div>
        <Button title="Save" func={() => { }} />
        <Button title="Cancel" func={() => setEditMode(false)} />
      </Show>

    </div>
  )
};

export default Profile;