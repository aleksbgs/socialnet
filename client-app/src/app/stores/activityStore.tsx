import { observable, action, computed, configure, runInAction } from 'mobx';
import { createContext, SyntheticEvent } from 'react';
import { IActivity } from '../models/activity';
import agent from '../api/agent';

configure({ enforceActions: 'always' })
export class ActivityStore {

  @observable activityRegistry = new Map();
  @observable activities: IActivity[] = [];
  @observable selectedActivity: IActivity | undefined;
  @observable loadingInitial = false;
  @observable editMode = false;
  @observable submiting = false;
  @observable target = '';


  @computed get activitiesByDate() {
    return Array.from(this.activityRegistry.values()).sort(
      (a, b) => Date.parse(a.date) - Date.parse(b.date));
  }
  @action loadActivities = async () => {
    this.loadingInitial = true;
    try {
      const activities = await agent.Activites.list();
      runInAction('loading activities', () => {
        activities.forEach((activity) => {
          activity.date = activity.date.split('.')[0]
          this.activityRegistry.set(activity.id, activity);
        });
        this.loadingInitial = false;
      })
    } catch (error) {
      runInAction('loading activities error', () => {
        console.log(error)
        this.loadingInitial = false
      })
    }
  }
  @action createActivity = async (activity: IActivity) => {
    this.submiting = true;
    try {
      await agent.Activites.create(activity)
      runInAction('creating activity', () => {
        this.activityRegistry.set(activity.id, activity);
        this.editMode = false;
        this.submiting = false;
      })

    } catch (error) {
      runInAction('create activity error', () => {
        console.log(error)
        this.submiting = false;
      })
    }
  }
  @action editActivity = async (activity: IActivity) => {
    this.submiting = true;
    try {
      await agent.Activites.update(activity)
      runInAction('edit activity error', () => {
        this.activityRegistry.set(activity.id, activity);
        this.selectedActivity = activity;
        this.editMode = false;
        this.submiting = false
      })
    } catch (error) {
      this.submiting = false;
      console.log(error)
    }
  }
  @action deleteActivity = async (event: SyntheticEvent<HTMLButtonElement>, id: string) => {
    this.submiting = true;
    this.target = event.currentTarget.name;
    try {
      await agent.Activites.delete(id);
      runInAction('delete activity error', () => {
        this.activityRegistry.delete(id);
        this.submiting = false;
        this.target = '';
      })

    } catch (error) {
      runInAction('error delete activity', () => {
        this.submiting = false;
        this.target = '';
        console.log(error);
      })
    }
  }
  @action openCreateForm = () => {
    this.editMode = true;
    this.selectedActivity = undefined;
  }
  @action openEditForm = (id: string) => {
    this.selectedActivity = this.activityRegistry.get(id);
    this.editMode = true;
  }
  @action cancelSelectedActivity = () => {
    this.selectedActivity = undefined;
  }
  @action cancelFormOpen = () => {
    this.editMode = false;
  }

  @action selectActivity = (id: string) => {
    this.selectedActivity = this.activityRegistry.get(id);
    this.editMode = false;
  }

}


export default createContext(new ActivityStore())
